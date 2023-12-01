import React from 'react';
import { useSelector } from 'react-redux';
import { PDFViewer, Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { format_date } from './utils.js';
import { resolveResource } from '@tauri-apps/api/path';
import { readBinaryFile } from '@tauri-apps/api/fs';

//const resourcePath = await resolveResource('resource/long_logo.png');
//const binaryLogo = await readBinaryFile(resourcePath);
//const Logo =  Buffer.from(binaryLogo).toString('base64');

//const LogoPath = await resolveResource('resource/square_logo.png');
//const LogoBinary = await readBinaryFile(LogoPath);
//const LogoB64 = String.fromCodePoint(...LogoBinary);
//const Logo = "data:image/png;base64," + btoa(LogoB64).toString('base64');

async function Logo(path) {
    const logoPath = await resolveResource(path);
    const logoBinary = await readBinaryFile(logoPath);
    const logoB64 = String.fromCodePoint(...logoBinary);
    return "data:image/png;base64," + btoa(logoB64).toString('base64');
}

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
        minHeight: 250
    },
    head_top: {
        top: 0
    },
    head_bottom: {
        position: "absolute",
        margin: 10,
        bottom: 0
    },
    logo_section: {
        position: "absolute",
        margin: "auto",
        height: 130,
        width: 275
    },
    body: {
        margin: 10,
        padding: 10,
        minHeight: 550,
        border: 1
    },
    table_header: {
        textAlign: "center",
        backgroundColor: "#999999",
        color: "#ffffff",
        padding: 5,
        marginBottom: 5
    },
    line_item: {
        padding: 5,
        margin: 2,
        border: 1.5,
        borderStyle: "dashed"
    },
    logo: {
        objectFit: "contain",
        objectPosition: "50% 50%",
        border: 1
    },
    message: {
        margin: 2,
        marginTop: 64,
        padding: 10,
        border: 1
    }

});

function parseAddress(address) {
    return address.split("\n");
};

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
export default function PrintPreview(props) {
    const currentOrderNumber = useSelector((state) => state.currentOrderNumber);
    const receiptList = useSelector((state) => state.receiptList);
    const companyInfo = useSelector((state) => state.companyInfo);
    const todaysDate = new Date();
    const addressLines = parseAddress(props.address.address);
    const giftMessage = props.address.giftMessage;
    // No matter what prop is passed on SellingForm, it always comes through as address

    const customerAddress = addressLines.map(function (line) {
        return (
            <Text>{line}</Text>
        );
    });

    const receiptListPDF = Array.from(receiptList).map(function (item) {
        return (
            <View style={styles.line_item}>
                <Text>
                    <Text style={{ border: 1, borderColor: "#dddddd"}}>
                    {item[1].quantity}
                    </Text> * {item[1].title}
                </Text>
                {item[1].variant !== "" && (
                    <Text style={{marginLeft: 24, borderTop: 1, borderColor: "#dddddd"}}> Variant - {item[1].variant}</Text>
                )}
            </View>
        );
    });

    return (
        <PDFViewer style={{ width: 600, height: 860 }}>
            <Document>
                <Page height={101} width={152} style={styles.page}>
                    <View style={styles.header}>
                        <View style={styles.head_section}>
                            <Text style={{ fontFamily: 'Times-Bold', fontSize: 22 }}>{companyInfo["name"]}</Text>
                            <Text>{companyInfo["url"]}</Text>
                            <View style={styles.head_bottom}>
                            <LabeledText boldText={'Date'}>{format_date(todaysDate)}</LabeledText>
                            <LabeledText boldText={'Order'}>{currentOrderNumber}</LabeledText>
                            <Text> </Text>
                            <LabeledText boldText={'Ship From'}></LabeledText>
                            <Text>{companyInfo["name"]}</Text>
                            <Text>{companyInfo["address"]}</Text>
                            <Text>{companyInfo["unit"]}</Text>
                            <Text>{companyInfo["city"]}, {companyInfo["state"]} {companyInfo["zip"]}</Text>
                            </View>
                        </View>
                        <View style={styles.head_section}>
                            <View style={styles.logo_section}>
                                <Image style={styles.logo} src={Logo(companyInfo['logo'])} />
                            </View>
                            <View style={styles.head_bottom}>
                            <LabeledText boldText={'Ship To'}></LabeledText>
                            {customerAddress}
                            </View>
                        </View>
                    </View>

                    <View style={styles.body}>
                        <View style={styles.table_header}>
                            <Text>Order Contents</Text>
                        </View>
                        {receiptListPDF}
                        {(giftMessage != "") &&
                        <View style={styles.message}>
                            <Text>Gift Message:</Text>
                            <Text>{giftMessage}</Text>
                        </View>
                        }
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    );
};