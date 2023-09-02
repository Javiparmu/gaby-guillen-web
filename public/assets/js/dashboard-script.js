import { SupabaseService } from "../../../src/libs/SupabaseService";

window.addEventListener('updatePainting', async (event) => {
    const painting = event?.detail;

    await SupabaseService.update(event?.detail, 'paintings', Number(painting.id));

    window.location.reload();
});

window.addEventListener('createPainting', async (event) => {
    await SupabaseService.insert(event?.detail, 'paintings');

    window.location.reload();
});

window.addEventListener('deletePainting', async (event) => {
    await SupabaseService.delete(event?.detail, 'paintings');

    window.location.reload();
});