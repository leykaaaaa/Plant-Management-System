function calculateCompatibility(userConditions, crop) {

    let score = 0;

    const factors = [];

    /*
     * SOIL
     * Weight: 25%
     */
    const cropSoils = crop.soil_type
        .toLowerCase()
        .split(",");

    if (cropSoils.includes(userConditions.soil.toLowerCase())) {

        score += 25;

        factors.push({
            name: "Soil",
            status: "Suitable",
            points: 25
        });

    } else {

        factors.push({
            name: "Soil",
            status: "Not Suitable",
            points: 0
        });

    }


    /*
     * WATER
     * Weight: 20%
     */
    const cropWater = crop.water_requirement
        .toLowerCase()
        .split(",");

    if (cropWater.includes(userConditions.water.toLowerCase())) {

        score += 20;

        factors.push({
            name: "Water",
            status: "Suitable",
            points: 20
        });

    } else {

        factors.push({
            name: "Water",
            status: "Not Suitable",
            points: 0
        });

    }


    /*
     * SUNLIGHT
     * Weight: 15%
     */
    if (
        crop.sunlight_requirement.toLowerCase() ===
        userConditions.sunlight.toLowerCase()
    ) {

        score += 15;

        factors.push({
            name: "Sunlight",
            status: "Suitable",
            points: 15
        });

    } else {

        factors.push({
            name: "Sunlight",
            status: "Not Suitable",
            points: 0
        });

    }


    /*
     * TEMPERATURE
     * Weight: 15%
     */
    const temperature =
        Number(userConditions.temperature);

    if (
        temperature >= Number(crop.min_temperature) &&
        temperature <= Number(crop.max_temperature)
    ) {

        score += 15;

        factors.push({
            name: "Temperature",
            status: "Suitable",
            points: 15
        });

    } else {

        factors.push({
            name: "Temperature",
            status: "Not Suitable",
            points: 0
        });

    }


    /*
     * ENVIRONMENT
     * Weight: 10%
     */
    const environments =
        crop.environment
            .toLowerCase()
            .split(",");

    if (
        environments.includes(
            userConditions.environment.toLowerCase()
        )
    ) {

        score += 10;

        factors.push({
            name: "Environment",
            status: "Suitable",
            points: 10
        });

    } else {

        factors.push({
            name: "Environment",
            status: "Not Suitable",
            points: 0
        });

    }


    /*
     * LOCATION
     *
     * For now, location is recorded but
     * not yet scored.
     *
     * Weather integration will contribute
     * additional decision support later.
     */


    let result;

    if (score >= 90) {

        result = "Highly Suitable";

    } else if (score >= 75) {

        result = "Suitable";

    } else if (score >= 50) {

        result = "Moderately Suitable";

    } else {

        result = "Not Recommended";

    }


    return {
        score,
        result,
        factors
    };
}


module.exports = {
    calculateCompatibility
};