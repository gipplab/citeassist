const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { log } = require('console');

/**
 * Process LaTeX source code and return the generated PDF
 * @route POST /latex/process
 * @param {string} req.body - The LaTeX source code
 * @returns {Object} The generated PDF file
 */
router.post('/process', async (req, res) => {
  try {
    console.log('Request headers:', req.headers);
    console.log('Request body type:', typeof req.body);
    console.log('Request body:', req.body);
    
    // Handle different types of request bodies
    let sourceText;
    
    if (typeof req.body === 'string') {
      // If body is already a string, use it directly
      sourceText = req.body;
    } else if (req.body && typeof req.body === 'object') {
      // If body is an object, check if it has a source property
      if (req.body.source) {
        sourceText = req.body.source;
      } else {
        // Otherwise stringify the entire object
        sourceText = JSON.stringify(req.body);
      }
    } else {
      // Handle raw buffer if received
      if (Buffer.isBuffer(req.body)) {
        sourceText = req.body.toString('utf8');
      } else {
        return res.status(400).json({ error: 'LaTeX source code is required in a valid format' });
      }
    }
    
    console.log('Source text being sent:', sourceText);
    
    if (!sourceText || sourceText.trim() === '') {
      return res.status(400).json({ error: 'LaTeX source code is required' });
    }
    
    // Post the LaTeX source to the Docker container as plain text
    const response = await axios.post('http://latex-render:8080', sourceText, {
      headers: {
        'Content-Type': 'text/plain'
      }
    });
    
    console.log('LaTeX service response:', response.data);
    
    // Get the UUID from the response
    const uuid = response.data;
    
    if (!uuid) {
      return res.status(500).json({ error: 'Failed to get UUID from LaTeX service' });
    }
    
    console.log('Got UUID:', uuid);
    
    // Poll for PDF completion
    let pdfReady = false;
    let attempts = 0;
    const maxAttempts = 30; // Maximum number of attempts (30 * 1000ms = 30 seconds)
    
    while (!pdfReady && attempts < maxAttempts) {
      try {
        console.log(`Attempt ${attempts + 1}: Checking if PDF is ready...`);
        // Check if PDF is ready
        const pdfResponse = await axios.get(`http://latex-render:8080/${uuid}`, {
          responseType: 'arraybuffer'
        });
        
        if (pdfResponse.status === 200) {
          console.log('PDF is ready, sending it back to the client');
          // PDF is ready, send it back to the client
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'attachment; filename="document.pdf"');
          return res.send(pdfResponse.data);
        }
      } catch (error) {
        console.log(`Attempt ${attempts + 1} failed:`, error.message);
        // PDF not ready yet, wait and retry
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      }
    }
    
    if (attempts >= maxAttempts) {
      return res.status(500).json({ error: 'PDF generation timed out' });
    }
    
  } catch (error) {
    console.error('Error processing LaTeX:', error);
    res.status(500).json({ error: 'Failed to process LaTeX source' });
  }
});

module.exports = router; 