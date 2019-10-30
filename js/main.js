for(let section of ["play","features","gameplay","contact"]){
    let trigger = document.getElementById(section)
    trigger.addEventListener("click",function(){
        let container = document.getElementById(section + "-holder")
        if(container.classList.contains("hidden")){
            container.classList.remove("hidden")
            container.classList.add("fade-in-section")
        } else {
            container.classList.add("hidden")
            container.classList.remove("fade-in-section")
        }
    })
}
document.getElementById("play-button").addEventListener("click",function(){
    document.location.href = "https://discordapp.com/oauth2/authorize?client_id=%20292789588399751168&scope=bot&permissions=268436481"
})
for(let index in document.getElementsByClassName("tab-opener")){
   setTimeout(function(){
    document.getElementsByClassName("tab-opener")[index].classList.remove("hidden")
    document.getElementsByClassName("tab-opener")[index].classList.add("fade-in-section")
   },index * 400)
}