/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
// import { Document, Page, pdfjs } from 'react-pdf'
import { Document, Page, pdfjs } from 'react-pdf'
import pdfjsWorker from 'react-pdf/node_modules/pdfjs-dist/build/pdf.worker.entry'

import { useParams } from 'react-router-dom'
import axios from 'axios'
import NavbarComponent from '../../component/NavbarComponent'
import '../user/pdf-viewer/PdfViewer.scss'
import NoPrint from './NoPrint'

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker
function PdfRead() {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [pdfBlob, setPdfBlob] = useState(null)
  // const noPrint = new NoPrint()

  const params = useParams()

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
  }

  const loadPdf = async () => {
    try {
      const url = `http://localhost:3005/book/pdf/${params.id}`
      const response = await axios.get(url, {
        responseType: 'blob',
      })
      setPdfBlob(URL.createObjectURL(response.data))
    } catch (error) {
      console.error('Error loading PDF:', error)
    }
  }

  useEffect(() => {
    loadPdf()
    // Panggil fungsi disableScreenshot setelah komponen dirender
    // noPrint.enable()
    // noPrint.disableRightClick()
    // noPrint.disableScreenshot()

    // return () => {
    //   noPrint.enableScreenshot()
    // }
  }, [])

  const handleContextMenu = (event) => {
    event.preventDefault() // Mencegah munculnya menu konteks
  }

  // const disableScreenshot = () => {
  //   noPrint.disableScreenshot()
  // }

  // const preventKeydown = (event) => {
  //   if (event.key === 'PrintScreen' || event.key === 'F12') {
  //     event.preventDefault()
  //     event.stopPropagation()
  //   }
  // }

  const handleNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1)
    }
  }

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1)
    }
  }

  const handleTouchNext = (event) => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1)
    }
  }

  const handleTouchPrevious = (event) => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1)
    }
  }

  const onPageLoadSuccess = () => {
    const canvasElement = document.querySelector('.react-pdf__Page canvas')
    canvasElement.addEventListener('click', handleNextPage)
    canvasElement.addEventListener('click', handlePreviousPage)
    // canvasElement.addEventListener('touchstart', handleTouchNext)
    // canvasElement.addEventListener('touchend', handleTouchPrevious)
  }

  return (
    <div>
      <div className="App">
        <NavbarComponent />
        <div className="container">
          <br />
          <h4>View PDF</h4>
          {pdfBlob && (
            <div className="pdf-container">
              <Document
                file={pdfBlob}
                onLoadSuccess={onDocumentLoadSuccess}
                onContextMenu={handleContextMenu}
              >
                <Page
                  pageNumber={pageNumber}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  renderInteractiveForms={false}
                  onLoadSuccess={onPageLoadSuccess}
                  className="pdf-page"
                />
              </Document>
              <div className="pdf-controls">
                <button
                  className="pdf-control-button"
                  onClick={handlePreviousPage}
                  disabled={pageNumber <= 1}
                >
                  Previous
                </button>
                <button
                  className="pdf-control-button"
                  onClick={handleNextPage}
                  disabled={pageNumber >= numPages}
                >
                  Next
                </button>
              </div>
              <p>
                Page {pageNumber} of {numPages}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PdfRead