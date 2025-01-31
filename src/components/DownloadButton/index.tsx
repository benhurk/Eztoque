import useListStore from '../../stores/listStore';

export default function DownloadButton() {
    const listItems = useListStore((state) => state.items);

    const date = new Date().toLocaleDateString();
    const data = JSON.stringify(listItems);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    return (
        <a
            className='btn btn-dropdown-item text-green'
            href={url}
            role='button'
            download={`Estoque${date}.json`}>
            <i className='bi bi-file-earmark-arrow-down-fill' />
            &nbsp;Baixar
        </a>
    );
}
