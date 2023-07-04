import React, { useState } from 'react'

import { FileUploader } from 'react-drag-drop-files'

const fileTypes = ['PNG', 'JPG', 'PDF']
const Uploader = () => {
    const [file, setFile] = useState(null)
    const onFileAttach = (attachedFile) => {
        setFile(attachedFile)
        console.log(attachedFile)
    }
    return (
        <FileUploader
            handleChange={onFileAttach}
            name="file"
            types={fileTypes}
        />
    )
}

export default Uploader
