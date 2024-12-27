import { useDispatch, useSelector } from "react-redux";

import { RootState } from "./store";
import { setFormMode } from "./store/reducers/form";

import Header from "./components/Header";
import RemoveAll from "./components/RemoveAll/RemoveAll";
import ListItem from "./components/ListItem";
import Modal from "./components/Modal";
import ItemForm from "./components/ItemForm";

function App() {
  const dispatch = useDispatch();
  const listItems = useSelector((state: RootState) => state.list.items);

  return (
    <>
      <Header />
      <main className="container py-4">
        <div className="mb-4 d-flex justify-content-center gap-3">
          <button type="button" className="btn btn-success" data-toggle="modal" data-target="#modal-form" onClick={() => dispatch(setFormMode('add'))}>
            <i className="bi bi-plus-lg" />
            Adicionar item
          </button>
          { listItems.length > 1 && <RemoveAll /> }
        </div>

        { 
          listItems.length > 0 &&
            <ul className="list-group">
              {
                listItems.map((item) => (
                  <ListItem key={item.id} id={item.id} name={item.name} qtdType={item.qtdType} quantity={item.quantity} alertQuantity={item.alertQuantity} />
                ))
              }
            </ul>
        }

        <Modal elementId="modal-form">
          <ItemForm />
        </Modal>
      </main>
    </>
  )
}

export default App;
