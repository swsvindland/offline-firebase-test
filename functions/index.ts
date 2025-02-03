import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';

// Initialize Firebase Admin
admin.initializeApp();

export const processNewPost = functions.firestore
    .document('posts/{documentId}')
    .onCreate(async (snap, context) => {
        try {
            // Get the document data
            const data = snap.data();

            // Make API call
            const response = await fetch('https://api.example.com/endpoint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`API call failed: ${response.statusText}`);
            }

            // Delete the document after successful API call
            await snap.ref.delete();

            console.log(`Successfully processed and deleted document ${context.params.documentId}`);

            return { success: true };

        } catch (error) {
            console.error('Error processing document:', error);
            throw error;
        }
    });