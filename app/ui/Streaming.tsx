'use client'

import React, { useEffect, useRef, useContext } from 'react';
import { io } from 'socket.io-client'; 
import { Mycontext } from './CodeEditor';

const Streaming = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const context = useContext(Mycontext)
  if (!context) {
    throw new Error("MyContext must be used within a MyContext.Provider");
  }
  const { stream } = context
  useEffect(() => {
    // TODO: Import URL from environment variable
    const socket = io("http://localhost:4949"); 
    
    // When connected to the socket
    socket.on('connect', () => {
      console.log('Socket.IO connection established');
      socket.emit('start', { 'cmd': 'start' })
    });

    // Handle incoming video stream data
    socket.on('video_stream', (data: string) => {
      // Create an image with the decode data of the base 64 image data
      const img = new Image();
      img.src = `data:image/jpeg;base64,${data}`

      // Render image on canvas
      img.onload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear canvas before drawing new frame
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);  // Draw the image on the canvas
          }
        }

        // Release the object URL after it's used to free up memory
        img.onerror = (error) => {
          console.error("Image loading error", error)
        }
      };
    });

    // Handle connection errors
    socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
    });

    // Handle socket disconnection
    socket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
    });

    // Cleanup when the component unmounts
    return () => {
      socket.emit('stop', 'hi')
      socket.disconnect();
    };
  }, []);
  return (
    <div className='basis-1/2 rounded-md'>
      <canvas className='w-full h-full' ref={canvasRef}></canvas>
    </div>
  );
};

export default Streaming;
