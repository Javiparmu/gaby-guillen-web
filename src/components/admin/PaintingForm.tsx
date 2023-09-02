import { useRef, type FC, useState, type ChangeEvent, type FormEvent } from "react"
import type { Painting } from "../../types";
import { baseFileUrl, defaultParams, s3Client } from "../../libs/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { base64ToFile, getQRCode, getSectionIdFromTitle, getUrlFromTitle } from "../../utils/helpers";
import lodash from 'lodash';
const { isEqual } = lodash;

interface PaintingFormProps {
    painting: Partial<Painting>;
    action: 'create' | 'update';
    close?: () => void;
}

export const PaintingForm: FC<PaintingFormProps> = ({painting, action, close}) => {
    const imageInput = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [image, setImage] = useState<string>(painting.image_url ?? '');
    const [title, setTitle] = useState(painting.title?? '');
    const [description, setDescription] = useState(painting.description ?? '');
    const [collection, setCollection] = useState(painting.collection ?? '');
    const [price, setPrice] = useState(painting.price ?? 0);

    const handleChangeImage = () => {
        if (imageInput?.current != null) imageInput.current.click();
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target?.files == null || e.target?.files.length === 0) return;
    
        const file = e.target.files[0];
        setFile(file);
    
        const reader = new FileReader();
    
        reader.onloadend = function() {
            setImage(reader.result as string);
        }
    
        reader.readAsDataURL(file);
    };

    const handleUpdate = async (e: FormEvent) => {
        e.preventDefault();

        if (file == null || title === '' || description === '') return;

        const updatedPainting: Partial<Painting> = {
            ...painting,
            title,
            description,
            collection,
            price,
        };

        if (isEqual(updatedPainting, painting) && image === painting.image_url) return;

        if (image !== painting.image_url) {
            const params = {
                ...defaultParams,
                Body: file,
                Key: file.name,
            };
            
            const command = new PutObjectCommand(params);

            await s3Client.send(command);

            updatedPainting.image_url = baseFileUrl + file.name;
        }

        close?.();

        const event = new CustomEvent('updatePainting', { detail: updatedPainting });

        window.dispatchEvent(event);
    };

    const handleCreate = async (e: FormEvent) => {
        e.preventDefault();

        if (file == null || title === '' || description === '') return;

        const params = {
            ...defaultParams,
            Body: file,
            Key: file.name,
        };
        
        const command = new PutObjectCommand(params);

        await s3Client.send(command);

        const paintingUrl = getUrlFromTitle(title);

        const base64Qr = getQRCode(paintingUrl);

        const qrFileName = getSectionIdFromTitle(title) + '.png';

        const qrFile = base64ToFile(base64Qr ?? '', qrFileName);

        const qrParams = {
            ...defaultParams,
            Body: qrFile,
            Key: qrFileName,
        };

        const qrCommand = new PutObjectCommand(qrParams);

        await s3Client.send(qrCommand);

        close?.();

        const createdPainting: Partial<Painting> = {
            ...painting,
            title,
            description,
            collection,
            price,
            image_url: baseFileUrl + file.name,
            qr: baseFileUrl + qrFileName,
        };

        const event = new CustomEvent('createPainting', { detail: createdPainting });

        window.dispatchEvent(event);
    };

    return (
        <form onSubmit={action === 'create' ? (e) => handleCreate(e) : (e) => handleUpdate(e)} className="space-y-4" action="#">
            <div className="col-span-full">
                <label className="block text-sm font-medium leading-6 text-gray-900">Imagen del cuadro</label>
                <div className="mt-2 flex items-center gap-x-3">
                    {image !== ''
                        ? <img className="h-16 w-16 object-contain rounded-md" src={image} />
                        : <div className="h-16 w-16 rounded-sm bg-gray-100" />
                    }
                    <input ref={imageInput} onChange={handleFileChange} type="file" name="image" id="image" className="hidden" />
                    <button type="button" onClick={handleChangeImage} className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Cambiar</button>
                </div>
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" name="title" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="La Gioconda" required />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descripción</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} name="description" id="description" placeholder="Describe el cuadro" className="resize-none overflow-y-scroll bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Colección</label>
                <input value={collection} onChange={(e) => setCollection(e.target.value)} type="text" name="collection" id="collection" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Arte pop" required />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Precio</label>
                <input value={price} onChange={(e) => setPrice(Number(e.target.value))} type="text" name="price" id="price" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="500" required />
            </div>
            <button type="submit" id="submit-button" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Guardar cambios</button>
        </form>
    )
}
