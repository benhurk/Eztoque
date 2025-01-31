import styles from './LoadButton.module.css';

import ListItemType from '../../types/ListItemTypes';
import useListStore from '../../stores/listStore';

export default function LoadButton() {
    const { items: listItems, addItem } = useListStore();

    const upload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();

        reader.onload = () => {
            const result = JSON.parse(reader.result as string);

            result.forEach((loadedItem: ListItemType) => {
                const item: ListItemType = {
                    id: listItems.length + loadedItem.id,
                    name: loadedItem.name,
                    qtdType: loadedItem.qtdType,
                    numberOf: loadedItem.numberOf,
                    options: loadedItem.options,
                    quantity: loadedItem.quantity,
                    alertQuantity: loadedItem.alertQuantity,
                    description: loadedItem.description,
                };

                const isValid = !Object.values(item).some(
                    (val) => typeof val === 'undefined'
                );

                if (isValid) addItem(item);
            });
        };

        if (e.target.files) {
            reader.readAsText(e.target.files[0]);
        }
    };

    return (
        <label className='btn btn-dropdown-item text-dark'>
            <i className='bi bi-file-earmark-arrow-up-fill' />
            &nbsp;Importar
            <input
                className={styles.fileInput}
                type='file'
                accept='.json, application/JSON'
                onChange={(e) => upload(e)}
            />
        </label>
    );
}
