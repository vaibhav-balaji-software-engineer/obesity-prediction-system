def generate_recommendations(input_data, prediction):

    recommendations = []

    if prediction == "Normal_Weight":

        recommendations.append(
            "You are currently in the Normal Weight category. "
            "Continue maintaining balanced eating habits, regular physical activity, "
            "adequate hydration, and healthy daily routines."
        )

    elif prediction == "Insufficient_Weight":

        recommendations.append(
            "Your prediction falls in the Insufficient Weight category. "
            "Focus on balanced, nutrient-dense meals and healthy weight gain."
        )

        recommendations.append(
            "Include a variety of protein, whole grains, fruits, vegetables, "
            "and other nutrient-rich foods in your diet."
        )

        recommendations.append(
            "Appropriate strength-based physical activity can support muscle health."
        )

    elif prediction == "Overweight_Level_I":

        recommendations.append(
            "Your prediction falls in the Overweight Level I category. "
            "Consider gradually improving physical activity, dietary quality, "
            "and eating habits to support a healthy weight."
        )

    elif prediction == "Overweight_Level_II":

        recommendations.append(
            "Your prediction falls in the Overweight Level II category. "
            "Focus on consistent physical activity, balanced nutrition, "
            "and healthier eating patterns."
        )

        recommendations.append(
            "Consider seeking guidance from a qualified healthcare or nutrition professional "
            "for a more personalized approach."
        )

    elif prediction == "Obesity_Type_I":

        recommendations.append(
            "Your prediction falls in the Obesity Type I category. "
            "Consider adopting sustainable improvements in physical activity, "
            "nutrition, and daily eating habits."
        )

        recommendations.append(
            "Focus on long-term healthy routines rather than short-term restrictive diets."
        )

    elif prediction == "Obesity_Type_II":

        recommendations.append(
            "Your prediction falls in the Obesity Type II category. "
            "Consistent improvements in physical activity, nutrition, "
            "and eating habits may help support healthier weight management."
        )

        recommendations.append(
            "Consider working with a qualified healthcare or nutrition professional "
            "to develop an individualized plan."
        )

    elif prediction == "Obesity_Type_III":

        recommendations.append(
            "Your prediction falls in the Obesity Type III category. "
            "Focus on sustainable improvements in nutrition, physical activity, "
            "and overall daily habits."
        )

        recommendations.append(
            "Professional healthcare or nutrition guidance is recommended "
            "for an individualized and sustainable approach."
        )

    else:

        recommendations.append(
            "Maintain balanced nutrition, regular physical activity, "
            "and healthy daily habits."
        )

    return recommendations