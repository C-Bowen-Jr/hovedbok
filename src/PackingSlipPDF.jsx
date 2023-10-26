import React from 'react';
import { PDFViewer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column'
    },
    header: {
        flexDirection: 'row'
    },
    head_section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
        minHeight: 250,
        border: 1
    },
    body: {
        margin: 10,
        padding: 10,
        minHeight: 550,
        border: 1
    }
});

// Create Document Component
export default function PrintPreview() {
    return (
        <PDFViewer style={{ width: 600, height: 860 }}>
            <Document>
                <Page height={101} width={152} style={styles.page}>
                    <View style={styles.header}>
                        <View style={styles.head_section}>
                            <Text>Section #1</Text>
                            <Text>This is line 2?</Text>
                        </View>
                        <View style={styles.head_section}>
                            <Text>Section #2</Text>
                        </View>
                    </View>
                    <View style={styles.body}>
                        <Text>Body Section</Text>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    );
};