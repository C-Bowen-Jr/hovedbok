import React from 'react';
import { useSelector } from 'react-redux';
import { PDFViewer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format_date } from './utils.js';

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
        width: 280,
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

const LabeledText = props => (
    <View style={{ fontFamily: 'Times-Bold' }}>
        <Text>
            {props.boldText}: {"\u0020"}
            <Text style={{ fontFamily: 'Times-Roman' }}>
                {props.children}
            </Text>
        </Text>
        
    </View>
);

// Create Document Component
export default function PrintPreview() {
    const currentOrderNumber = useSelector((state) => state.currentOrderNumber);
    const todaysDate = new Date();

    return (
        <PDFViewer debug={true} style={{ width: 600, height: 860 }}>
            <Document>
                <Page height={101} width={152} style={styles.page}>
                    <View style={styles.header}>
                        <View style={styles.head_section}>
                            <Text style={{ fontFamily: 'Times-Bold', fontSize: 22}}>COMPANY NAME</Text>
                            <Text>www.company-website.com</Text>
                            <Text style={{ fontSize: 78 }}> </Text>
                            <LabeledText boldText={'Ship From'}></LabeledText>
                            <Text>Company Name</Text>
                            <Text>Address Line 1</Text>
                            <Text>Address Line 2</Text>
                            <Text>City, State 12345</Text>
                        </View>
                        <View style={styles.head_section}>
                            <LabeledText boldText={'Date'}>{format_date(todaysDate)}</LabeledText>
                            <LabeledText boldText={'Order'}>{currentOrderNumber}</LabeledText>
                            <Text> </Text>
                            <LabeledText boldText={'Ship To'}></LabeledText>
                            <Text>Customer Name</Text>
                            <Text>Address Line 1</Text>
                            <Text>Address Line 2</Text>
                            <Text>City, State 12345</Text>
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