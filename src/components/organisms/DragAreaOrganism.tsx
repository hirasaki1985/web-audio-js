import React, { useCallback } from 'react'
import { DropEvent, FileRejection, useDropzone } from 'react-dropzone'
import styled from 'styled-components'

export interface DragAreaOrganismProps {
  onDragFile: (file: File, arrayBuffer: string | ArrayBuffer) => void
}

const DragAreaOrganism: React.FC<DragAreaOrganismProps> = (
  props: DragAreaOrganismProps,
) => {
  const { onDragFile } = props

  const onDrop = useCallback(
    (
      acceptedFiles: File[],
      // fileRejections: FileRejection[],
      // event: DropEvent,
    ) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader()

        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = () => {
          // Do whatever you want with the file contents
          const binaryStr = reader.result
          if (binaryStr) {
            onDragFile(file, binaryStr)
          }
        }
        reader.readAsArrayBuffer(file)
      })
    },
    [],
  )

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <div>
      <Container {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>ここにwavファイルをドラッグ&ドロップ</p>
      </Container>
    </div>
  )
}

const getColor = (props: any) => {
  if (props.isDragAccept) {
    return '#00e676'
  }
  if (props.isDragReject) {
    return '#ff1744'
  }
  if (props.isDragActive) {
    return '#2196f3'
  }
  return '#eeeeee'
}

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props) => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
`

export default DragAreaOrganism
