import {
  Button,
  EditableText,
  InputGroup,
  Toaster,
  Position,
} from "@blueprintjs/core";
import axios from "axios";
import { useEffect, useState } from "react";

const AppToaster = Toaster.create({
  position: Position.TOP,
});

function App() {
  const [empleado, setEmployees] = useState([]);
  const [departmentos, setDepartments] = useState([]);
  const [newName, setNewName] = useState("");
  const [newDepartment, setNewDepartment] = useState("");
  const [newAddress, setNewAddress] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8001/").then((response) => {
      const { data } = response;
      setEmployees(data.result);
    });

    axios.get("http://localhost:8001/departments").then((response) => {
      const { data } = response;
      setDepartments(data.result);
    });
  }, []);

  const addEmployee = () => {
    const nombre = newName.trim();
    const departmento = newDepartment;
    const direccion = newAddress.trim();
    if (nombre && departmento && direccion) {
      axios
        .post("http://localhost:8001/", {
          nombre: nombre,
          departmento: departmento,
          direccion: direccion,
        })
        .then((response) => {
          const { data } = response;
          setEmployees([...empleado, data.result]);
          setNewName("");
          setNewAddress("");
          setNewDepartment("");
        });
    }
  };

  const onChangeHandler = (id, key, value) => {
    console.log({ id, key, value });
    setEmployees((values) => {
      return values.map((item) =>
        item.id === id ? { ...item, [key]: value } : item
      );
    });
  };

  const updateAddress = (id) => {
    const data = empleado.find((item) => item.id === id);
    axios.put(`http://localhost:8001/${id}`, data).then((response) => {
      AppToaster.show({
        message: "Data updated successfully",
        intent: "success",
        timeout: 3000,
      });
    });
  };

  const deleteEmployee = (id) => {
    axios.delete(`http://localhost:8001/${id}`).then((response) => {
      setEmployees((values) => {
        return values.filter((item) => item.id !== id);
      });

      AppToaster.show({
        message: "Employee deleted successfully",
        intent: "success",
        timeout: 3000,
      });
    });
  };

  return (
    <div className="App">
      <table className="bp4-html-table .modifier">
        <thead>
          <tr>
            <th>Empleado ID</th>
            <th>Nombre</th>
            <th>Departamento</th>
            <th>Direccion</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
          {empleado.map((empleado) => {
            const { id, nombre, direccion, departmento } = empleado;
            return (
              <tr key={id}>
                <td>{id}</td>
                <td>{nombre}</td>
                <td>{departmento}</td>
                <td>
                  <EditableText
                    value={direccion}
                    onChange={(value) => onChangeHandler(id, "direccion", value)}
                  />
                </td>
                <td>
                  <Button intent="primary" onClick={() => updateAddress(id)}>
                    Actualizar
                  </Button>
                  &nbsp;
                  <Button intent="danger" onClick={() => deleteEmployee(id)}>
                    Borrar
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>
              <InputGroup
                placeholder="Agregue nombre..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </td>
            <td>
              <div class="bp4-html-select .modifier">
                <select
                  onChange={(e) => setNewDepartment(e.target.value)}
                  value={newDepartment}
                >
                  <option selected value="">
                    Seleccione departamento
                  </option>
                  {departmentos.map((departmento) => {
                    const { id, nombre } = departmento;
                    return (
                      <option key={id} value={id}>
                        {nombre}
                      </option>
                    );
                  })}
                </select>
                <span class="bp4-icon bp4-icon-double-caret-vertical"></span>
              </div>
            </td>
            <td>
              <InputGroup
                placeholder="Agrega direccion..."
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              />
            </td>
            <td>
              <Button intent="success" onClick={addEmployee}>
                Agregar Empleado
              </Button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
