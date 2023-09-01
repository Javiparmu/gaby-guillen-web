import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types";
import { toDataURL, QRCodeToDataURLOptions } from "qrcode";

export const setCookie = (name: string, value: string, days: number) => {
    let expires = "";
    
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

export const getCookie = (name: string) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");

    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];

        while (c.charAt(0) === " ") {
            c = c.substring(1, c.length);
        }

        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }

    return null;
};

export const createSupabaseClient = () => {
    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

    return createClient<Database>(supabaseUrl, supabaseKey);
}

const options: QRCodeToDataURLOptions = {
  width: 400,
  margin: 2,
};

export const getQRCode = (value: string) => {
  let qrValue: string | undefined = undefined;

  toDataURL(value, options, (err: Error, url: string) => {
    if (err) {
      console.error(err);
      return;
    }
    qrValue = url;
  });

  return qrValue;
};

const baseUrl = import.meta.env.PUBLIC_BASE_URL;

export const getUrlFromTitle = (title: string) => {
    return baseUrl + '#' + getSectionIdFromTitle(title);
}

export const getSectionIdFromTitle = (title: string) => {
    return normalizeText(title.toLocaleLowerCase().replace(/ /g, "-"));
}

function normalizeText(text: string) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/g, "n").replace(/Ñ/g, "N");
}

export function base64ToFile(base64Image: string, filename: string) {
    function base64ToBlob(base64: string, mime: string) {
        mime = mime || '';
        var sliceSize = 1024;
        var byteChars = window.atob(base64);
        var byteArrays = [];

        for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
            var slice = byteChars.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, {type: mime});
    }

    var mime = base64Image.split(',')[0].split(':')[1].split(';')[0];
    var pureBase64 = base64Image.split(',')[1];

    var blob = base64ToBlob(pureBase64, mime);

    return new File([blob], filename, {type: mime});
}
