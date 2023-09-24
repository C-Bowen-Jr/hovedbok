import { invoke } from '@tauri-apps/api/tauri';
import { useSelector } from 'react-redux';
import jsonFile from '../public/data.json';

export function updateSave() {
    const tagPresets = useSelector((state) => state.tagPresets);
    var updatedJson = jsonFile;
    updatedJson["tagPresets"] = tagPresets;
    invoke('update_save_file', {invokeMessage: JSON.stringify(jsonFile)});
};