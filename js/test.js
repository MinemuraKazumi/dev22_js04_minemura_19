const wrapper = document.querySelector(".wrapper"),
inputPart = wrapper.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
wIcon = document.querySelector(".weather-part img"),
arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup", e=>{
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", ()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess,onError);
    }else{
        alert("あなたのブラウザは位置情報を取得できません");
    }
});

function onSuccess(position){
    const {latitude, longitude} = position.coords;
    api =`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=[API ID]&lang=ja`;
    fetchData();

}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");    
}

function requestApi(city){
    // https://teratail.com/questions/313073 appidには{}をつけない &lang=jaで日本語変換 &units=metric単位を摂氏に
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=[API ID]&lang=ja`;
    fetchData();

}

function fetchData(){
    infoTxt.innerText = "天気の位置情報";
    infoTxt.classList.add("pending");
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));

}

function weatherDetails(info){
    infoTxt.classList.replace("pending","error");
    // 404は都市名がない時のエラーメッセージ
    if(info.cod == "404"){
        infoTxt.innerText = `${inputField.value} 対応していない都市名です`;
    }else{
        const city = info.name;
        const country = info.sys.country;
        const {description,id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        if(id == 800){
            wIcon.src = "img/hare.png";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "img/arashi.png";
        }else if(id >= 600 && id <= 622){
            wIcon.src = "img/yuki.png";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "img/harekumori.png";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "img/kumori.png";
        }else if((id >= 300 && id <= 321) || (id >= 500 && id <= 531)){
            wIcon.src = "img/ame.png";
        }
        // id条件毎に画像を設定 https://openweathermap.org/weather-conditions

        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

        infoTxt.classList.remove("pending","error");
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
});