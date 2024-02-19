const generateForm = document.querySelector(".generator-form");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "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"; // Replace this with your actual API key
let isImageGenerator = false;

const upadateImagecard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadbtn = imgCard.querySelector(".download-btn");
        const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImg;

        imgElement.onload = () => {
            imgCard.classList.remove("loading");
            downloadbtn.setAttribute("href", aiGeneratedImg);
            downloadbtn.setAttribute("download", `${new Date().getTime()}.jpg`);
        };
    });
};

const generateAiImages = async (userPrompt, userImgQuantity) => {
    try {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImgQuantity),
                size: "512x512",
                response_format: "b64_json"
            })
        });

        if (!response.ok) throw new Error("Failed to generate images! Please Try again");

        const { data } = await response.json();
        upadateImagecard([...data]);
    } catch (error) {
        alert(error.message);
    } finally {
        isImageGenerator = false;
    }
};

const handleFormSubmission = (e) => {
    e.preventDefault();
    if (isImageGenerator) return;
    isImageGenerator = true;

    const userPrompt = e.target[0].value;
    const userImgQuantity = e.target[1].value;

    console.log(userPrompt, userImgQuantity);

    const imgCardMarkup = Array.from({ length: userImgQuantity }, () =>
        `<div class="img-card loading">
             <img src="images/loading.svg" alt="image">
             <a href="#" class="download-btn">
               <img src="images/icon.svg" alt="download icon">
             </a>
        </div>`
    ).join("");
    imageGallery.innerHTML = imgCardMarkup;

    generateAiImages(userPrompt, userImgQuantity);
};

generateForm.addEventListener("submit", handleFormSubmission);
