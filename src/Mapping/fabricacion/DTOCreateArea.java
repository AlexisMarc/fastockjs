package fastock.fastock.Mapping.fabricacion;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size; 

import fastock.fastock.Utils.EnumArea;
public class DTOCreateArea {
    // -----------------------Nombre-----------------------//
    @NotEmpty(message = "El nombre no debe estar vacío")
    @Size(min = 2, max = 60, message = "El nombre debe tener entre 2 y 30 caracteres")
    private String nombre;
    // ************************************************//
    // -------------Relacion con fabricacion-----------//
    // ************************************************//
    @NotNull(message = "La fabricación no debe estar vacía")
    private Integer fabricacion;
    // ************************************************//
    // -------------usuario o Empresa--------------//
    // ************************************************//
    @NotEmpty(message = "El encargado no debe estar vacía")
    private EnumArea tipo;
    // ************************************************//
    // -------------Relacion con empresa y usuario---------------//
    // ************************************************//
    @NotNull(message = "El encargado no debe estar vacía")
    private Integer idencargado;

    // ----------------------NUMERADOR---------------------//
    @NotNull(message = "El numerador no debe estar vacío")
    private Integer numerador;

    // ************************************************//
    // -------------GETTERS AND SETTERS/CONSTRUCTORES----------------//
    // ************************************************//
    public DTOCreateArea() {
    }

    

    public DTOCreateArea(
            @NotEmpty(message = "El nombre no debe estar vacío") @Size(min = 2, max = 60, message = "El nombre debe tener entre 2 y 30 caracteres") String nombre,
            @NotNull(message = "La fabricación no debe estar vacía") Integer fabricacion,
            @NotEmpty(message = "El encargado no debe estar vacía") EnumArea tipo,
            @NotNull(message = "El encargado no debe estar vacía") Integer idencargado,
            @NotNull(message = "El numerador no debe estar vacío") Integer numerador) {
        this.nombre = nombre;
        this.fabricacion = fabricacion;
        this.tipo = tipo;
        this.idencargado = idencargado;
        this.numerador = numerador;
    }



    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Integer getFabricacion() {
        return fabricacion;
    }

    public void setFabricacion(Integer fabricacion) {
        this.fabricacion = fabricacion;
    }

    public EnumArea getTipo() {
        return tipo;
    }

    public void setTipo(EnumArea tipo) {
        this.tipo = tipo;
    }

    public Integer getIdencargado() {
        return idencargado;
    }

    public void setIdencargado(Integer idencargado) {
        this.idencargado = idencargado;
    }



    public Integer getNumerador() {
        return numerador;
    }



    public void setNumerador(Integer numerador) {
        this.numerador = numerador;
    }

    

}
