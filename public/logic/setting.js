function cambiarContrasena() {
    var validator = $("#formPass").kendoValidator().data("kendoValidator");
    if (validator.validate()) {
      var data = $('#formPass').serialize();
      $.post("/user/editPassword",data, function (datares) {
        
        if (datares=="Contraseña modificada con éxito") {
          alert(datares);
          location.href ="/logout";
        } else {
          alert(datares);
        }
      });
    } else {

    }
}