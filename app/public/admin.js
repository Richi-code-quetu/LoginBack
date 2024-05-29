document.getElementsByTagName("button")[0].addEventListener("click", () => {
    document.cookie = 'jwt=; Path=/; Expires=Thu, 03 Apr 1997 00:00:01 GMT;';
    document.location.href = "/"
});