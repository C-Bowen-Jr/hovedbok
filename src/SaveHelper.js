import { invoke } from '@tauri-apps/api/tauri';
import { useSelector } from 'react-redux';
import jsonFile from '../public/data.json';

export function updateSave() {
    const tagPresets = useSelector((state) => state.tagPresets);
    console.log(tagPresets);
    var updatedJson = jsonFile;
    updatedJson["tagPresets"] = tagPresets;
    console.log(jsonFile);
    console.log(updatedJson);
    //invoke('update_save_file', {payload: JSON.stringify(updatedJson)})
            //.then((result) => console.log(result));
};