package fastock.fastock.Mapping.usuario;

public class DTOcargo {
    // -----------------------ID-----------------------//
    private Integer id;

    // -----------------------NOMBRE-----------------------//
    private String nombre;
    // -----------------------Estado-----------------------//
    private Boolean estado;

    // ************************************************//
    // -------------Relacion con usuario--------------//
    // // ************************************************//

    // ************************************************//
    // ------------- CONSTRUCTORES/GETTERS AND SETTERS--------------//
    // ************************************************//

    public DTOcargo() {
    }

    

    public DTOcargo(Integer id, String nombre, Boolean estado) {
        this.id = id;
        this.nombre = nombre;
        this.estado = estado;
    }



    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Boolean getEstado() {
        return estado;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }
    

}
