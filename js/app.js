const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let editando;

class Citas {
    constructor(){
        this.citas = []
    }

    agregarCita(cita){
        this.citas = [...this.citas, cita]
    }

    eliminarCita(id){
        this.citas = this.citas.filter( cita => cita.id !== id)
    }

    editarCita(citaActualizada){
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ?  citaActualizada : cita)
    }
}

class UI{
    imprimirAlerta(mensaje,tipo){
        const divAlerta = document.createElement('div')
        divAlerta.classList.add('text-center', 'alert', 'd-block', 'col-12')
    
        if(tipo){
            divAlerta.classList.add('alert-danger')
        }else{
            divAlerta.classList.add('alert-success')
        }

        divAlerta.textContent = mensaje;

        document.querySelector('#contenido').insertBefore(divAlerta, document.querySelector('.agregar-cita'))

        setTimeout(() => {
            divAlerta.remove()
        }, 5000);
    }
    imprimirCitas({citas}){

        this.limpiarHTML()
        
        citas.forEach(cita =>  {
            const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita

            const divCita= document.createElement('div')
            divCita.classList.add('cita' ,'p-3')
            divCita.dataset.id = id;

            const mascotaParrafo = document.createElement('h2')
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder')
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML= `
            <span class = "font-weight-bolder">Propietario: </span> ${propietario}
            `

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML= `
            <span class = "font-weight-bolder">Telefono: </span> ${telefono}
            `

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML= `
            <span class = "font-weight-bolder">Fecha: </span> ${fecha}
            `

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML= `
            <span class = "font-weight-bolder">Hora: </span> ${hora}
            `

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML= `
            <span class = "font-weight-bolder">Sintomas: </span> ${sintomas}
            `

            const btnRemove = document.createElement('button')
            btnRemove.classList.add('btn', 'btn-danger', 'mr-2')
            btnRemove.innerHTML= 'Eliminar <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />  </svg>' ;

            btnRemove.onclick = () => eliminarCita(id)

            const btnEditar = document.createElement('button')
            btnEditar.classList.add('btn','btn-info','mr-2')
            btnEditar.innerHTML= 'Editar <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>'
            btnEditar.onclick = () => cargarEdicion(cita)

            divCita.appendChild(mascotaParrafo)
            divCita.appendChild(propietarioParrafo)
            divCita.appendChild(telefonoParrafo)
            divCita.appendChild(fechaParrafo)
            divCita.appendChild(horaParrafo)
            divCita.appendChild(sintomasParrafo)
            divCita.appendChild(btnRemove)
            divCita.appendChild(btnEditar)

            contenedorCitas.appendChild(divCita)
        })
    }

    limpiarHTML(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild)
        }
    }
}

const ui = new UI();
const administrarCitas = new Citas()

eventListeners()
function eventListeners() {
    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);

    formulario.addEventListener('submit', nuevaCita)
}

const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha:'',
    hora:'',
    sintomas:''
}

function datosCita(e) {
    citaObj[e.target.name] = e.target.value
}

function nuevaCita(e){
    e.preventDefault()

    const {mascota, propietario, telefono, fecha, hora, sintomas} = citaObj

    if(mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === ''){
       ui.imprimirAlerta('Todos los campos son obligatorios', 'error')

        return ; 
    }

    if(editando){
        ui.imprimirAlerta('Editado Correctamente')

        administrarCitas.editarCita({...citaObj})

        
        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

        editando = false


    }else{
        citaObj.id = Date.now()

        administrarCitas.agregarCita({...citaObj})

        ui.imprimirAlerta('Se agrego correctamente')
    }

    //Generar un id

    reiniciarObjeto()

    formulario.reset()
    
    ui.imprimirCitas(administrarCitas);
}

function reiniciarObjeto(){
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}

function eliminarCita(id){
   administrarCitas.eliminarCita(id)

   ui.imprimirAlerta('La cita ha sido eliminada correctamente')

   ui.imprimirCitas(administrarCitas)
}

function cargarEdicion(cita){
    const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

    //Llenar los input

    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    //llenar el objeto 

    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando= true;
    
}