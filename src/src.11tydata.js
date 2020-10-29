const axios = require("axios");

module.exports = async () => {
    const result = await axios.get("https://dog.ceo/api/breed/retriever/golden/images/random");

    const dog = result.data.message;

    return { 
        dogImage: dog
    };
}