import type { Painting } from '../../types';
import { PaintingForm } from './PaintingForm';

interface CreateModalProps {
    painting: Partial<Painting>;
    onClose: () => void;
}

const CreateModal = ({painting, onClose}: CreateModalProps) => {
    return (
        <>
            <div onClick={onClose} id="update-bg" className="fixed top-0 left-0 w-screen h-screen bg-black opacity-10" />
            <div id="update-modal" aria-hidden="true" className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50 w-[500px] p-4 overflow-x-hidden overflow-y-auto max-h-[90vh]">
                <div className="relative">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <button onClick={onClose} id="close-button" type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <div className="px-6 py-6 lg:px-8">
                            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Nuevo cuadro</h3>
                            <PaintingForm painting={painting} action='create' close={onClose} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateModal
