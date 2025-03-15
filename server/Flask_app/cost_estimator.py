from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return "Flask server is running."

def format_currency(value):
    lakhs = value // 100000
    remainder = value % 100000
    thousands = remainder // 1000
    if lakhs > 0 and thousands > 0:
        return f"{lakhs} lakh {thousands} thousand PKR"
    elif lakhs > 0:
        return f"{lakhs} lakh PKR"
    elif thousands > 0:
        return f"{thousands} thousand PKR"
    else:
        return f"{round(value)} PKR"

# Function to calculate development cost based on the received data
def calculate_development_cost(area_sqft, num_floors, quality_selections, electrical_quality, finishing_touch_quality, standard_materials_data, quality_material_data, electrical_cost_data, quality_material_quantity_data):
    try:
        # Step 1: Calculate total and covered area
        total_area = float(area_sqft) * int(num_floors)
        covered_area = total_area * 0.88

        # Step 2: Calculate standard materials costs
        standard_materials_cost = sum(
            item['Rate (PKR/sqft)'] * item['Quantity (units/sqft)'] * covered_area for item in standard_materials_data
        )

        # Step 3: Calculate quality materials costs
        quality_materials_cost = sum(
            quality_material_data[material]['High'] * quality_material_quantity_data[material] * covered_area
            for material in quality_material_data
        )

        # Step 4: Calculate electrical costs
        electrical_costs = electrical_cost_data.get(electrical_quality, electrical_cost_data['Medium'])
        electrical_cost = electrical_costs["Switch Boards"] * (total_area // 100)

        # Step 5: Calculate fixed costs
        fixed_costs = 155000 + 145500  # Booster Pump and Submersible Water Transfer Pump

        # Step 6: Apply finishing touch quality
        base_cost = standard_materials_cost + quality_materials_cost + electrical_cost + fixed_costs
        finishing_cost = base_cost + base_cost * (0.20 if finishing_touch_quality == 'High' else (-0.20 if finishing_touch_quality == 'Low' else 0))

        # Step 7: Calculate labor cost
        labor_cost = 450 * covered_area

        # Step 8: Calculate total cost
        total_cost = base_cost + finishing_cost + labor_cost

        development_cost_per_sqft = total_cost / covered_area

        # Return all costs, including total area, covered area, and development cost per sqft
        return {
            'total_area': total_area,
            'covered_area': covered_area,
            'development_cost_per_sqft': development_cost_per_sqft,
            'Standard Materials': standard_materials_cost,
            'Quality Materials': quality_materials_cost,
            'Electrical Components': electrical_cost,
            'Fixed Costs': fixed_costs,
            'Finishing Touch': abs(finishing_cost),
            'Labor Cost': labor_cost,
            'Total Cost': total_cost,
            'Base Cost': base_cost
        }
    except Exception as e:
        raise e  # Reraise the exception if caught

@app.route('/api/calculate-cost', methods=['POST'])
def calculate_cost():
    try:
        data = request.json
        
        # Accept the dynamic material, quality, and electrical cost data from the Node.js server
        standard_materials_data = data.get('standard_materials_data', [])
        quality_material_data = data.get('quality_material_data', {})
        quality_material_quantity_data = data.get('quality_material_quantity_data', {})
        electrical_cost_data = data.get('electrical_cost_data', {})

        # Other input fields from React
        area_sqft = float(data.get('area_sqft', 0))
        num_floors = int(data.get('num_floors', 1))
        quality_selections = data.get('quality_selections', {})
        electrical_quality = data.get('electrical_quality', 'Medium')
        finishing_touch_quality = data.get('finishing_touch_quality', 'Medium')

        # Calculate the development cost
        cost_breakdown = calculate_development_cost(
            area_sqft,
            num_floors,
            quality_selections,
            electrical_quality,
            finishing_touch_quality,
            standard_materials_data,
            quality_material_data,
            electrical_cost_data,
            quality_material_quantity_data
        )

        # Return the cost breakdown as a JSON response
        return jsonify(cost_breakdown), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
