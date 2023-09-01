import { useState } from 'react';
import type { Painting } from '../../types';
import UpdateModal from './UpdateModal';
import CreateModal from './CreateModal';
import { DeleteModal } from './DeleteModal';
import { ActionDropdown } from './ActionDropdown';

interface AdminDashboardProps {
    paintings: Painting[];
}

const AdminDashboard = ({paintings}: AdminDashboardProps) => {
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedPainting, setSelectedPainting] = useState<Partial<Painting>>();

    const onCreate = () => {
        setCreateModalOpen(true)

        const painting: Partial<Painting> = {
            title: '',
            description: '',
            collection: '',
            price: 0,
            image_url: '',
            qr: null
        };

        setSelectedPainting(painting);
    };

    const onEdit = () => {
        setUpdateModalOpen(true);
    };

    const onDeleteClick = () => {
        setDeleteModalOpen(true);
    };

    const onDelete = () => {
        setDeleteModalOpen(false);
        
        if (selectedPainting) {
            const event = new CustomEvent('deletePainting', { detail: selectedPainting?.id });
    
            window.dispatchEvent(event);

            const painting = paintings.find(painting => String(painting.id) === String(selectedPainting.id));

            if (painting) {
                const index = paintings.indexOf(painting);
                paintings.splice(index, 1);
            }

            setSelectedPainting(undefined);
        }
    };

    const showActions = (id: string) => {
        if (String(selectedPainting?.id) === id) {
            setSelectedPainting(undefined);
        } else {
            const painting = paintings.find(painting => String(painting.id) === id);

            if (painting) {
                setSelectedPainting(painting);
            }
        }
    };

    return (
        <main className="flex flex-col items-center overflow-x-auto md:overflow-visible">
            <h1 className="text-4xl text-center font-bold text-gray-800 dark:text-white mt-20">Lista de cuadros</h1>
            <div className="flex flex-col items-end justify-end mt-10">
                <button onClick={() => onCreate()} id="submit-button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Nuevo cuadro</button>
                <div className="relative shadow-md sm:rounded-lg mt-5 min-w-[60vw] overflow-x-auto md:overflow-x-visible">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Imagen
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Nombre
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Descripción
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Colección
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Precio
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Acción
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paintings.map(painting => (
                                <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700" key={painting.id}>
                                    <th scope="row" className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            {painting.image_url
                                                ? <img className="h-16 w-16 object-cover rounded-md" src={painting.image_url} />
                                                : <div className="h-16 w-16 rounded-sm bg-gray-100" />
                                            }
                                        </div>
                                    </th>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {painting.title}
                                    </th>
                                    <td className="px-6 py-4 max-w-[20ch] truncate whitespace-nowrap">
                                        {painting.description}
                                    </td>
                                    <td className="px-6 py-4">
                                        {painting.collection}
                                    </td>
                                    <td className="px-6 py-4">
                                        {painting.price}€
                                    </td>
                                    <td className="px-6 py-4">
                                        <ActionDropdown
                                            isOpen={selectedPainting?.id === painting.id}
                                            onEdit={onEdit}
                                            onDelete={onDeleteClick}
                                            showActions={showActions}
                                            id={String(painting.id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <button onClick={() => window.location.href = "/"} id="submit-button" className="my-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Ir a la página principal</button>
            {updateModalOpen && selectedPainting &&
                <UpdateModal painting={selectedPainting} onClose={() => setUpdateModalOpen(false)} />
            }
            {createModalOpen && selectedPainting &&
                <CreateModal painting={selectedPainting} onClose={() => setCreateModalOpen(false)} />
            }
            {deleteModalOpen && selectedPainting &&
                <DeleteModal onDelete={onDelete} onClose={() => setDeleteModalOpen(false)} />
            }
        </main>
    );
};

export default AdminDashboard;
