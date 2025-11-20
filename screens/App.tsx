import React, { useState, createContext, useCallback, useEffect } from 'react';
import type { User, Test, Booking, Report, SampleStatus, Notification, PaymentStatus, IAppContext } from '../types';
import LoginScreen from './screens/LoginScreen';
import UserPanel from './screens/UserPanel';
import AdminPanel from './screens/AdminPanel';
import { Icon, Spinner } from './components';

// MOCK DATA
const mockUsers: User[] = [
  { id: '1', email: 'user@example.com', password: 'password', name: 'John Doe', role: 'user', phone: '9876543210', address: '123 Main St, Anytown', age: 34 },
  { id: '2', email: 'mrattitude885@gmail.com', password: 'Ahmed@43211', name: 'Admin Ahmed', role: 'admin' },
];

const fullTestDatabase: Test[] = [
    { id: 't1', code: 'LDBIO0035', name: 'ADENOSINE DEAMINASE (ADA)', mrp: 750, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't2', code: 'LDBIO0125', name: 'Alanine Amino-transferase (ALT) SGPT', mrp: 210, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't3', code: 'LDBIO0138', name: 'AMYLASE, SERUM', mrp: 550, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't4', code: 'LDBIO0147', name: 'ANGIOTENSIN CONVERTING ENZYME (ACE)', mrp: 600, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't5', code: 'LDBIO0202', name: 'Aspartate Aminotransferase (AST) SGOT', mrp: 210, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't6', code: 'LDBIO0240', name: 'BILIRUBIN TOTAL, DIRECT & INDIRECT', mrp: 300, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't7', code: 'LDBIO0253', name: 'Blood Glucose Fasting (FBS)', mrp: 80, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't8', code: 'LDBIO0255', name: 'Blood Glucose Post prandial (PPBS)', mrp: 80, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't9', code: 'LDBIO0258', name: 'BLOOD UREA NITROGEN (BUN)', mrp: 230, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't10', code: 'LDBIO0281', name: 'C3 Complement', mrp: 700, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't11', code: 'LDBIO0282', name: 'C4 Complement', mrp: 650, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't12', code: 'LDBIO0345', name: 'Ceruloplasmin, Serum', mrp: 1200, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't13', code: 'LDBIO0360', name: 'Cholesterol Total', mrp: 250, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't14', code: 'LDBIO0402', name: 'C-REACTIVE PROTEIN (CRP), ǪUANTITATIVE', mrp: 600, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't15', code: 'LDBIO0403', name: 'Creatine Phosphokinase (CK/CPK), Serum', mrp: 500, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't16', code: 'LDBIO0404', name: 'Creatine Phosphokinase MB (CPK-MB)', mrp: 470, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't17', code: 'LDBIO0408', name: 'CREATININE, SERUM', mrp: 200, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't18', code: 'LDBIO0497', name: 'Electrolytes, Serum', mrp: 550, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't19', code: 'LDBIO0634', name: 'HBA1C (GLYCATED HAEMOGLOBIN)', mrp: 600, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't20', code: 'LDBIO0882', name: 'IRON STUDIES, BASIC', mrp: 600, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't21', code: 'LDBIO0885', name: 'Iron, Serum', mrp: 350, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't22', code: 'LDBIO0904', name: 'KIDNEY/RENAL FUNCTION TESTS GOLD (KFT GOLD /RFT GOLD)', mrp: 1060, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't23', code: 'LDBIO0929', name: 'LIPASE', mrp: 750, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't24', code: 'LDBIO0936', name: 'Liver Function Test Gold (LFT Gold)', mrp: 900, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't25', code: 'LDBIO0937', name: 'LUPUS ANTICOAGULANT (DRVVT)', mrp: 1700, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't26', code: 'LDBIO1152', name: 'SERUM PROTEIN ELECTROPHORESIS (SPE)', mrp: 850, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't27', code: 'LDBIO1207', name: 'Total Iron Binding Capacity (TIBC)', mrp: 650, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't28', code: 'LDBIO1209', name: 'Total Protein , Serum', mrp: 190, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't29', code: 'LDBIO1225', name: 'Triglycerides, Serum', mrp: 340, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't30', code: 'LDBIO1229', name: 'Troponin - T', mrp: 1500, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't31', code: 'LDBIO1247', name: 'URIC ACID, SERUM', mrp: 200, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't32', code: 'LDBIO1573', name: 'Kappa Free Light Chain, Serum', mrp: 2600, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't33', code: 'LDBIO1796', name: 'LIPID PROFILE', mrp: 750, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't34', code: 'LDCOA1107', name: 'Prothombin Time (PT/INR)', mrp: 400, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't35', code: 'LDCYT0560', name: 'FLUID EXAMINATION, ROUTINE', mrp: 700, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't36', code: 'LDCYT1046', name: 'PAP SMEAR BY LBC / LIǪUID BASED CYTOLOGY', mrp: 1300, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't37', code: 'LDCYT1047', name: 'PAP SMEAR BY LBC WITH HPV HIGH RISK DETECTION', mrp: 2350, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't38', code: 'LDFLO0334', name: 'CD4/CD8, FLOWCYTOMETRY', mrp: 2000, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't39', code: 'LDHEM0014', name: 'ABNORMAL HEMOGLOBIN STUDY (HB ELECTROPHORESIS)', mrp: 1000, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't40', code: 'LDHEM0257', name: 'Blood Group ABO and Rh Typing', mrp: 120, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't41', code: 'LDHEM0378', name: 'COMPLETE BLOOD COUNT (CBC)', mrp: 350, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't42', code: 'LDHEM0379', name: 'Complete Urine Examination', mrp: 120, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't43', code: 'LDHEM0382', name: 'Coombs Test, Direct', mrp: 550, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't44', code: 'LDHEM0383', name: 'COOMBS TEST, INDIRECT', mrp: 550, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't45', code: 'LDHEM0504', name: 'Erythrocyte Sedimentation Rate (ESR)', mrp: 120, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't46', code: 'LDHEM0603', name: 'Glucose-6 Phosphate Dehydrogenase (G6PD), Ǫuantitative', mrp: 1050, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't47', code: 'LDHEM0622', name: 'Hemoglobin (Hb)', mrp: 110, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't48', code: 'LDHEM0626', name: 'HEMOGRAM (CBC WITH ESR)', mrp: 500, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't49', code: 'LDHEM0948', name: 'Malaria Antigen Test', mrp: 650, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't50', code: 'LDHEM1058', name: 'PERIPHERAL BLOOD SMEAR FOR MALARIAL PARASITE (PS FOR MP)', mrp: 180, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't51', code: 'LDHEM1566', name: 'Platelet Count', mrp: 120, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't52', code: 'LDHIS0680', name: 'HISTOPATHOLOGY- LARGE SPECIMEN', mrp: 1900, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't53', code: 'LDHIS0681', name: 'HISTOPATHOLOGY- MEDIUM SPECIMEN', mrp: 1300, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't54', code: 'LDHIS0691', name: 'HISTOPATHOLOGY- SMALL SPECIMEN', mrp: 800, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't55', code: 'LDIMM0120', name: 'ALPHA FETOPROTEIN (AFP), SERUM', mrp: 800, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't56', code: 'LDIMM0152', name: 'ANTI - ds DNA , IFA in Dilutions', mrp: 3250, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't57', code: 'LDIMM0169', name: 'ANTI MULLERIAN HORMONE (AMH), SERUM', mrp: 2200, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't58', code: 'LDIMM0174', name: 'Anti Phospholipid Antibodies IgG & IgM', mrp: 1450, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't59', code: 'LDIMM0231', name: 'BETA HCG, SERUM', mrp: 800, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't60', code: 'LDIMM0277', name: 'C -PEPTIDE (FASTING)', mrp: 1100, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't61', code: 'LDIMM0285', name: 'CA 19-9', mrp: 1100, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't62', code: 'LDIMM0286', name: 'CA 72-4 (Gastric Cancer)', mrp: 1900, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't63', code: 'LDIMM0287', name: 'CA 125', mrp: 1400, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't64', code: 'LDIMM0288', name: 'CA 15-3', mrp: 1250, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't65', code: 'LDIMM0292', name: 'Calcium', mrp: 210, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't66', code: 'LDIMM0305', name: 'CARCINO EMBYONIC ANTIGEN (CEA), SERUM', mrp: 720, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't67', code: 'LDIMM0390', name: 'CORTISOL (MORNING SAMPLE)', mrp: 700, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't68', code: 'LDIMM0481', name: 'DUAL MARKER (DOUBLE MARKER)- FIRST TRIMESTER', mrp: 2400, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't69', code: 'LDIMM0484', name: 'E2 (ESTRADIOL)', mrp: 700, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't70', code: 'LDIMM0528', name: 'FERRITIN', mrp: 800, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't71', code: 'LDIMM0568', name: 'FOLATE/FOLIC ACID, SERUM', mrp: 1100, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't72', code: 'LDIMM0569', name: 'FOLLICLE STIMULATING HORMONE (FSH)', mrp: 650, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't73', code: 'LDIMM0723', name: 'HOMA IR (insulin resistance)', mrp: 1000, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't74', code: 'LDIMM0863', name: 'IMMUNOGLOBULIN IGE (TOTAL IGE)', mrp: 900, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't75', code: 'LDIMM0874', name: 'INSULIN (FASTING)', mrp: 850, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't76', code: 'LDIMM0879', name: 'INSULIN PP', mrp: 850, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't77', code: 'LDIMM0938', name: 'LUTEINIZING HORMONE (LH)', mrp: 600, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't78', code: 'LDIMM0963', name: 'Microalbumin Creatinine Ratio, Spot Urine', mrp: 700, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't79', code: 'LDIMM1025', name: 'NT-pro BNP', mrp: 3800, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't80', code: 'LDIMM1092', name: 'PROGESTERONE', mrp: 700, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't81', code: 'LDIMM1094', name: 'PROLACTIN', mrp: 650, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't82', code: 'LDIMM1096', name: 'PROSTATE SPECIFIC ANTIGEN, FREE (FREE PSA)', mrp: 850, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't83', code: 'LDIMM1097', name: 'PROSTATE SPECIFIC ANTIGEN, TOTAL (TOTAL PSA)', mrp: 950, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't84', code: 'LDIMM1110', name: 'PTH (INTACT)-PARATHYROID HORMONE', mrp: 1600, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't85', code: 'LDIMM1112', name: 'ǪUADRUPLE MARKER- SECOND TRIMESTER', mrp: 3500, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't86', code: 'LDIMM1186', name: 'TESTOSTERONE TOTAL', mrp: 800, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't87', code: 'LDIMM1191', name: 'THYROID PROFILE FREE', mrp: 1200, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't88', code: 'LDIMM1192', name: 'THYROID PROFILE TOTAL', mrp: 660, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't89', code: 'LDIMM1195', name: 'THYROID STIMULATING HORMONE (TSH), ULTRASENSITIVE', mrp: 350, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't90', code: 'LDIMM1212', name: 'Toxoplasma Antibodies panel', mrp: 1000, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't91', code: 'LDIMM1227', name: 'TRIPLE MARKER- SECOND TRIMESTER', mrp: 2900, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't92', code: 'LDIMM1268', name: 'VITAMIN B12 (CYANOCOBALAMIN)', mrp: 1210, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't93', code: 'LDIMM1274', name: 'VITAMIN D, 25 - OH', mrp: 1500, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't94', code: 'LDIMM1314', name: 'Dengue Fever Antibodies ( IgG, IgM) ELISA', mrp: 1870, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't95', code: 'LDIMM1320', name: 'FSH/LH/PROLACTIN', mrp: 1800, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't96', code: 'LDIMM1321', name: 'FT4 & TSH', mrp: 650, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't97', code: 'LDIMM1638', name: 'ANC PROFILE WITH TSH', mrp: 1750, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't98', code: 'LDIMU0072', name: 'AMH GOLD PLUS', mrp: 2500, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't99', code: 'LDLKP1592', name: 'Troponin I- Ǫualitative', mrp: 1900, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't100', code: 'LDMIC0040', name: 'AFB smear (Acid fast bacilli)', mrp: 300, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't101', code: 'LDMIC0417', name: 'CULTURE AND SENSITIVITY, AEROBIC- VITEK', mrp: 750, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't102', code: 'LDMIC0419', name: 'CULTURE AUTOMATED BLOOD AEROBIC- VITEK', mrp: 1500, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't103', code: 'LDMIC0424', name: 'CULTURE MTB, AUTOMATED', mrp: 950, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't104', code: 'LDMIC1327', name: 'STOOL CULTURE AND SENSITIVITY', mrp: 750, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't105', code: 'LDMIC1328', name: 'CULTURE AND SENSITIVITY, URINE- VITEK', mrp: 750, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't106', code: 'LDMICRO2028', name: 'Urine Culture & Sensitivity', mrp: 500, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't107', code: 'LDMOL0594', name: 'GENEXPERT MTB/RIF', mrp: 2800, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't108', code: 'LDMOL0637', name: 'HBV DNA PCR Ǫuantitative, Real Time PCR', mrp: 5000, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't109', code: 'LDMOL0641', name: 'Hepatitis C (HCV) Viral RNA Genotype', mrp: 6800, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't110', code: 'LDMOL0645', name: 'HCV RNA PCR Ǫuantitative, Real Time PCR', mrp: 6000, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't111', code: 'LDMOL0719', name: 'HLA B-27 by PCR', mrp: 2700, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't112', code: 'LDMOL0895', name: 'KARYOTYPING BY G BANDING', mrp: 3000, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't113', code: 'LDMOL1020', name: 'NON-INVASIVE PRENATAL TEST (NIPT)', mrp: 9990, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't114', code: 'LDMOL1183', name: 'TB DNA PCR, ǪUALITATIVE', mrp: 1980, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't115', code: 'LDMOL1466', name: 'H3 VIRAL MARKER PROFILE HIV, HBSAG,HCV', mrp: 1180, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't116', code: 'LDSER0141', name: 'ANA BY IMMUNOBLOT', mrp: 3300, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't117', code: 'LDSER0142', name: 'ANA IFA reflex to ANA Immunoblot', mrp: 2800, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't118', code: 'LDSER0143', name: 'ANA IFA, IN DILUTIONS', mrp: 1000, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't119', code: 'LDSER0145', name: 'ANCA Profile, ELISA', mrp: 2000, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't120', code: 'LDSER0149', name: 'HIV 1 & 2 ANTIBODIES, RAPID', mrp: 610, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't121', code: 'LDSER0154', name: 'ANTI CYCLIC CITRULLINATED PEPTIDE (CCP)', mrp: 2000, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't122', code: 'LDSER0172', name: 'Anti Phospholipid Antibodies (APA), IgG', mrp: 900, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't123', code: 'LDSER0173', name: 'Anti Phospholipid Antibodies (APA), IgM', mrp: 900, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't124', code: 'LDSER0185', name: 'Anti Streptolysin-O (ASO) Ǫuantitative', mrp: 620, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't125', code: 'LDSER0188', name: 'ANTI TPO (THYROID PEROXIDASE) ANTIBODY)', mrp: 1500, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't126', code: 'LDSER0306', name: 'Cardiolipin Antibodies IgG, IgM', mrp: 1500, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't127', code: 'LDSER0464', name: 'Dengue NS1 Antigen, Rapid', mrp: 750, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't128', code: 'LDSER0521', name: 'FAECAL CALPROTECTIN', mrp: 3200, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't129', code: 'LDSER0618', name: 'H. Pylori Antibody IgG', mrp: 2000, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't130', code: 'LDSER0619', name: 'H. Pylori Antibody IgM', mrp: 2500, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't131', code: 'LDSER0652', name: 'HEPATITIS A VIRUS IGM ANTIBODY (HAV IGM)', mrp: 1100, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't132', code: 'LDSER0653', name: 'Hepatitis A Virus Total Antibody (HAV Total)', mrp: 1300, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't133', code: 'LDSER0656', name: 'HEPATITIS B SURFACE ANTIGEN (HBSAG), CLIA/ELISA', mrp: 1400, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't134', code: 'LDSER0657', name: 'HEPATITIS B SURFACE ANTIGEN (HBSAG), RAPID METHOD', mrp: 580, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't135', code: 'LDSER0663', name: 'Hepatitis B Virus core Total Antibody (HBc Total)', mrp: 1100, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't136', code: 'LDSER0665', name: 'Hepatitis B Virus envelope Antigen (HBeAg)', mrp: 900, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't137', code: 'LDSER0668', name: 'HEPATITIS C ANTIBODIES (HCV), RAPID', mrp: 500, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't138', code: 'LDSER0671', name: 'Hepatitis E Virus IgG Antibody (HEV IgG)', mrp: 1500, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't139', code: 'LDSER0672', name: 'HEPATITIS E VIRUS IGM ANTIBODY (HEV IGM)', mrp: 1500, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't140', code: 'LDSER1113', name: 'ǪUANTIFERON TB GOLD/INTERFERON GAMMA RELEASE ASSAY (IGRA)', mrp: 3000, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't141', code: 'LDSER1122', name: 'RHEUMATOID FACTOR(RA)', mrp: 650, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't142', code: 'LDSER1196', name: 'Tissue Transglutaminase (tTG) IgA Antibody', mrp: 1300, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't143', code: 'LDSER1201', name: 'TORCH 10 PROFILE', mrp: 3200, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't144', code: 'LDSER1234', name: 'Typhidot IgM', mrp: 550, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't145', code: 'LDSER1262', name: 'VDRL (RPR), Serum', mrp: 300, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't146', code: 'LDSER1288', name: 'WIDAL (SLIDE AGGLUTINATION)', mrp: 250, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't147', code: 'LDSER1322', name: 'Hb, TLC, DLC, Platelets', mrp: 300, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't148', code: 'LDSER1730', name: 'Typhidot , Salmonella IgG', mrp: 480, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't149', code: 'LDSER1810', name: 'H3 Viral marker profile HIV, HbsAg,HCV, Rapid', mrp: 1000, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't150', code: 'LDMOL0216', name: 'BCR/ABL Ǫuantitative (International Scale)', mrp: 6500, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
    { id: 't151', code: 'LDIHC1674', name: 'IHC marker- ER, PgR, Her2neu', mrp: 3600, category: 'General', sampleType: 'Blood', referenceRange: 'N/A', unit: 'N/A', active: true },
];

const mockBookings: Booking[] = [
  { id: 'b1', userId: '1', name: 'John Doe', age: 34, phone: '9876543210', address: '123 Main St, Anytown', tests: [fullTestDatabase[40], fullTestDatabase[32]], totalAmount: 8650, discount: 1730, paidAmount: 6920, dueAmount: 0, paymentMethod: 'Online', paymentStatus: 'Fully Paid', bookingDate: new Date().toISOString(), status: 'Collected' },
  { id: 'b2', userId: '1', name: 'John Doe', age: 34, phone: '9876543210', address: '123 Main St, Anytown', tests: [fullTestDatabase[87]], totalAmount: 660, discount: 132, paidAmount: 200, dueAmount: 328, paymentMethod: 'Split', paymentStatus: 'Partially Paid', bookingDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'Report Ready' },
];

const mockReports: Report[] = [
  { id: 'r1', bookingId: 'b2', userId: '1', pdfUrl: '/mock-report.pdf', generatedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), mockContent: `PATIENT: John Doe\nTEST: TFT\nTSH: 6.5 mIU/L (High)\n` },
];

const mockNotifications: Notification[] = [
    { id: 'n1', title: 'Special Offer!', message: 'Get 20% off on all health packages this week.', timestamp: new Date().toISOString(), read: false, userId: 'all' }
];

export const AppContext = createContext<IAppContext>({} as IAppContext);

// MAIN APP COMPONENT
const SplashScreen: React.FC = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary via-purple-700 to-secondary animate-fadeIn">
        <div className="bg-white/20 p-6 rounded-full backdrop-blur-md shadow-2xl animate-pulse">
             <Icon name="logo" className="w-24 h-24 text-white" />
        </div>
        <h1 className="text-5xl font-extrabold text-white mt-6 tracking-tight">SMARTLAB AI</h1>
        <p className="text-indigo-100 mt-2 font-medium tracking-widest text-sm uppercase">Next Gen Diagnostics</p>
    </div>
);

const App: React.FC = () => {
  const [appLoading, setAppLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [tests, setTests] = useState<Test[]>(fullTestDatabase);
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  useEffect(() => {
    setTimeout(() => setAppLoading(false), 2000);
  }, []);
  
  const handleLogin = (user: User) => setCurrentUser(user);
  const handleLogout = () => setCurrentUser(null);

  const handleSignUp = (newUserInfo: Omit<User, 'id' | 'role' | 'blocked'>): boolean => {
    if (users.some(u => u.email.toLowerCase() === newUserInfo.email.toLowerCase())) return false;
    const newUser: User = { ...newUserInfo, id: `user-${Date.now()}`, role: 'user', blocked: false };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const handlePasswordReset = useCallback((email: string, newPass: string): boolean => {
      let userFound = false;
      setUsers(prev => prev.map(u => {
          if(u.email.toLowerCase() === email.toLowerCase()) {
              userFound = true;
              return { ...u, password: newPass };
          }
          return u;
      }));
      return userFound;
  }, []);
  
  const sendNotification = useCallback((notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
      const newNotif: Notification = {
          ...notificationData,
          id: `n-${Date.now()}`,
          timestamp: new Date().toISOString(),
          read: false,
      };
      setNotifications(prev => [newNotif, ...prev]);
  }, []);
  
  const updateBookingStatus = useCallback((bookingId: string, status: SampleStatus) => {
    const booking = bookings.find(b => b.id === bookingId);
    
    // Send specific "WhatsApp style" notification based on status
    if (booking) {
        let message = '';
        switch(status) {
            case 'Collected': message = "Your Sample Is Collected."; break;
            case 'In Lab': message = "Your Sample Reach In Main lab."; break;
            case 'Processing': message = "Your Test Is Processing."; break;
            case 'Report Ready': message = "Your Final Report Is Ready. Download In App In Report Section."; break;
            case 'Completed': message = "Order Completed. Thank you for choosing SmartLab."; break;
            default: message = `Your booking status is now: ${status}`;
        }
        
        // Add status specific notification
        sendNotification({
            userId: booking.userId,
            title: `Update: Booking #${bookingId.slice(0,6)}`,
            message: message
        });
        
        // Add extra instruction for Report Ready
        if (status === 'Report Ready') {
             sendNotification({
                userId: booking.userId,
                title: "Download Report",
                message: "You can download your final report from the 'Reports' section in the app."
            });
        }
    }

    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
  }, [bookings, sendNotification]);

  const createBooking = useCallback((newBookingData: Omit<Booking, 'id' | 'bookingDate' | 'status'>) => {
    const newBooking: Booking = {
      ...newBookingData,
      id: `b-${Date.now()}`,
      bookingDate: new Date().toISOString(),
      status: 'Pending',
    };
    setBookings(prev => [newBooking, ...prev]);
    
    // Notify Admin (Mock broadcast to admin user logic if implemented, else just user confirm)
    sendNotification({
        userId: newBooking.userId,
        title: "Booking Confirmed",
        message: `Your booking #${newBooking.id.slice(0,6)} has been received. We will assign a phlebotomist soon.`
    });
  }, [sendNotification]);

  const updateBookingDetails = useCallback((bookingId: string, updatedDetails: Partial<Booking>) => {
    let bookingToNotify: Booking | undefined;
    setBookings(prev => prev.map(b => {
        if (b.id === bookingId) {
            const wasPaid = b.paymentStatus === 'Fully Paid';
            const updatedBooking = { ...b, ...updatedDetails };
            if (updatedBooking.paymentStatus === 'Fully Paid' && !wasPaid) {
                bookingToNotify = updatedBooking;
            }
            return updatedBooking;
        }
        return b;
    }));

    if (bookingToNotify) {
        sendNotification({
            userId: bookingToNotify.userId,
            title: "Payment Completed",
            message: `Your payment of ₹${(bookingToNotify.totalAmount - bookingToNotify.discount).toFixed(2)} for Booking #${bookingToNotify.id.slice(0,6)} is fully completed. Thank you.`
        });
    }
  }, [sendNotification]);

  const markNotificationsAsRead = useCallback((userId: string) => {
    setNotifications(prev => prev.map(n => (n.userId === userId || n.userId === 'all') ? { ...n, read: true } : n));
  }, []);

  const addReport = useCallback((reportData: Omit<Report, 'id'>) => {
    const newReport: Report = { ...reportData, id: `r-${Date.now()}`};
    setReports(prev => [newReport, ...prev]);
    updateBookingStatus(reportData.bookingId, 'Report Ready');
    // Notification handled in updateBookingStatus
  }, [updateBookingStatus]);

  const updateUser = useCallback((userId: string, updatedDetails: Partial<User>) => {
      setUsers(prev => prev.map(u => u.id === userId ? {...u, ...updatedDetails} : u));
  }, []);
  
  const updateUserProfile = useCallback((userId: string, profileData: Partial<Pick<User, 'name' | 'phone' | 'address' | 'age'>>) => {
      setUsers(prev => prev.map(u => u.id === userId ? {...u, ...profileData} : u));
      if (currentUser?.id === userId) {
          setCurrentUser(prev => prev ? { ...prev, ...profileData } : null);
      }
  }, [currentUser?.id]);

  const deleteUser = useCallback((userId: string) => {
      setUsers(prev => prev.filter(u => u.id !== userId));
  }, []);

  const addTest = useCallback((testData: Omit<Test, 'id'>) => {
      const newTest: Test = { ...testData, id: `t-${Date.now()}`};
      setTests(prev => [newTest, ...prev]);
  }, []);

  const updateTest = useCallback((testId: string, updatedDetails: Partial<Test>) => {
      setTests(prev => prev.map(t => t.id === testId ? {...t, ...updatedDetails} : t));
  }, []);

  const appContextValue: IAppContext = {
    user: currentUser,
    users, tests, bookings, reports, notifications,
    handlePasswordReset,
    updateBookingStatus, createBooking, updateBookingDetails,
    markNotificationsAsRead, sendNotification, addReport,
    updateUser, deleteUser, addTest, updateTest, updateUserProfile,
  };

  const renderContent = () => {
    if (appLoading) {
      return <SplashScreen />;
    }
    
    if (!currentUser) {
      return <LoginScreen onLogin={handleLogin} onSignUp={handleSignUp} users={users} />;
    }
    if (currentUser.blocked) {
        return <div className="flex items-center justify-center h-screen text-center p-4 bg-white text-red-500 font-bold">Your account has been blocked. Please contact support.</div>;
    }
    if (currentUser.role === 'admin') {
      return <AdminPanel user={currentUser} onLogout={handleLogout} />;
    }
    return <UserPanel user={currentUser} onLogout={handleLogout} />;
  };

  return (
    <AppContext.Provider value={appContextValue}>
        <div key={currentUser ? 'app' : 'login'} className="animate-fadeIn">
          {renderContent()}
        </div>
    </AppContext.Provider>
  );
};

export default App;