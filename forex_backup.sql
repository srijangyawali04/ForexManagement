--
-- PostgreSQL database dump
--

-- Dumped from database version 16.6 (Ubuntu 16.6-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.6 (Ubuntu 16.6-0ubuntu0.24.04.1)

DROP TABLE IF EXISTS exchange_rates CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS voucher CASCADE;
DROP TYPE IF EXISTS public.users_designation_enum CASCADE;
DROP TYPE IF EXISTS public.users_role_enum CASCADE;
DROP TYPE IF EXISTS public.users_user_status_enum CASCADE;
DROP TYPE IF EXISTS public.voucher_voucher_cancellation_enum CASCADE;
DROP TYPE IF EXISTS public.voucher_voucher_status_enum CASCADE;

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: users_designation_enum; Type: TYPE; Schema: public; Owner: sri
--

CREATE TYPE public.users_designation_enum AS ENUM (
    'Deputy Director',
    'Assistant Director',
    'Head Assistant',
    'Assistant',
    'Deputy Assistant'
);


ALTER TYPE public.users_designation_enum OWNER TO sri;

--
-- Name: users_role_enum; Type: TYPE; Schema: public; Owner: sri
--

CREATE TYPE public.users_role_enum AS ENUM (
    'Creator',
    'Verifier',
    'Admin',
    'SuperAdmin'
);


ALTER TYPE public.users_role_enum OWNER TO sri;

--
-- Name: users_user_status_enum; Type: TYPE; Schema: public; Owner: sri
--

CREATE TYPE public.users_user_status_enum AS ENUM (
    'Enabled',
    'Disabled'
);


ALTER TYPE public.users_user_status_enum OWNER TO sri;

--
-- Name: voucher_voucher_cancellation_enum; Type: TYPE; Schema: public; Owner: sri
--

CREATE TYPE public.voucher_voucher_cancellation_enum AS ENUM (
    'Yes',
    'No'
);


ALTER TYPE public.voucher_voucher_cancellation_enum OWNER TO sri;

--
-- Name: voucher_voucher_status_enum; Type: TYPE; Schema: public; Owner: sri
--

CREATE TYPE public.voucher_voucher_status_enum AS ENUM (
    'Pending',
    'Verified',
    'Canceled',
    'Edit'
);


ALTER TYPE public.voucher_voucher_status_enum OWNER TO sri;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: exchange_rates; Type: TABLE; Schema: public; Owner: sri
--

CREATE TABLE public.exchange_rates (
    id integer NOT NULL,
    currency_iso character varying(10) NOT NULL,
    currency_name character varying(255) NOT NULL,
    buy_rate numeric(15,4) NOT NULL,
    sell_rate numeric(15,4) NOT NULL,
    unit integer NOT NULL,
    "fetchedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.exchange_rates OWNER TO sri;

--
-- Name: exchange_rates_id_seq; Type: SEQUENCE; Schema: public; Owner: sri
--

CREATE SEQUENCE public.exchange_rates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.exchange_rates_id_seq OWNER TO sri;

--
-- Name: exchange_rates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sri
--

ALTER SEQUENCE public.exchange_rates_id_seq OWNED BY public.exchange_rates.id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: sri
--

CREATE TABLE public.transactions (
    transaction_id integer NOT NULL,
    currency_name character varying(50) NOT NULL,
    currency_iso_code character varying(3) NOT NULL,
    exchange_rate numeric(10,4) NOT NULL,
    fc_amount numeric(15,2) NOT NULL,
    commission numeric(10,2),
    "NPR_amount" numeric(15,2) NOT NULL,
    created_by character varying(50) NOT NULL,
    updated_by character varying(50) DEFAULT 'Pending'::character varying NOT NULL,
    transaction_type character varying(15) NOT NULL,
    "voucherVoucherNumber" integer NOT NULL
);


ALTER TABLE public.transactions OWNER TO sri;

--
-- Name: transactions_transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: sri
--

CREATE SEQUENCE public.transactions_transaction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transactions_transaction_id_seq OWNER TO sri;

--
-- Name: transactions_transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sri
--

ALTER SEQUENCE public.transactions_transaction_id_seq OWNED BY public.transactions.transaction_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: sri
--

CREATE TABLE public.users (
    staff_code character varying NOT NULL,
    password character varying(255) NOT NULL,
    staff_name character varying(255) NOT NULL,
    designation public.users_designation_enum NOT NULL,
    role public.users_role_enum NOT NULL,
    email character varying(100) NOT NULL,
    mobile_number character varying(10) NOT NULL,
    user_status public.users_user_status_enum NOT NULL,
    remarks character varying(255),
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO sri;

--
-- Name: voucher; Type: TABLE; Schema: public; Owner: sri
--

CREATE TABLE public.voucher (
    voucher_number integer NOT NULL,
    fiscal_year character varying NOT NULL,
    voucher_date timestamp without time zone DEFAULT now() NOT NULL,
    customer_name character varying(255) NOT NULL,
    voucher_staff_code character varying(255),
    passport_number character varying(255) NOT NULL,
    mobile_number character varying(10) NOT NULL,
    customer_address character varying(255) NOT NULL,
    itrs_code character varying,
    visiting_country character varying(255),
    purpose_of_visit character varying(255),
    source_of_foreign_currency character varying(255),
    travel_order_ref_number character varying(100),
    voucher_status public.voucher_voucher_status_enum NOT NULL,
    "createdBy" character varying(255),
    "updatedBy" character varying(255),
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    ordered_by character varying
);


ALTER TABLE public.voucher OWNER TO sri;

--
-- Name: exchange_rates id; Type: DEFAULT; Schema: public; Owner: sri
--

ALTER TABLE ONLY public.exchange_rates ALTER COLUMN id SET DEFAULT nextval('public.exchange_rates_id_seq'::regclass);


--
-- Name: transactions transaction_id; Type: DEFAULT; Schema: public; Owner: sri
--

ALTER TABLE ONLY public.transactions ALTER COLUMN transaction_id SET DEFAULT nextval('public.transactions_transaction_id_seq'::regclass);


--
-- Data for Name: exchange_rates; Type: TABLE DATA; Schema: public; Owner: sri
--

COPY public.exchange_rates (id, currency_iso, currency_name, buy_rate, sell_rate, unit, "fetchedAt") FROM stdin;
1	INR	Indian Rupee	160.0000	160.1500	100	2025-02-09 05:24:38.812
2	USD	U.S. Dollar	139.5900	140.1900	1	2025-02-09 05:24:38.82
3	EUR	European Euro	144.9000	145.5200	1	2025-02-09 05:24:38.825
4	GBP	UK Pound Sterling	173.8400	174.5900	1	2025-02-09 05:24:38.831
5	CHF	Swiss Franc	153.9100	154.5700	1	2025-02-09 05:24:38.837
6	AUD	Australian Dollar	87.7000	88.0800	1	2025-02-09 05:24:38.842
7	CAD	Canadian Dollar	97.4300	97.8500	1	2025-02-09 05:24:38.849
8	SGD	Singapore Dollar	103.3300	103.7700	1	2025-02-09 05:24:38.853
9	JPY	Japanese Yen	9.1800	9.2200	10	2025-02-09 05:24:38.86
10	CNY	Chinese Yuan	19.1500	19.2300	1	2025-02-09 05:24:38.866
11	SAR	Saudi Arabian Riyal	37.2200	37.3800	1	2025-02-09 05:24:38.87
12	QAR	Qatari Riyal	38.2900	38.4500	1	2025-02-09 05:24:38.876
13	THB	Thai Baht	4.1500	4.1700	1	2025-02-09 05:24:38.88
14	AED	UAE Dirham	38.0100	38.1700	1	2025-02-09 05:24:38.885
15	MYR	Malaysian Ringgit	31.4400	31.5700	1	2025-02-09 05:24:38.889
16	KRW	South Korean Won	9.6600	9.7000	100	2025-02-09 05:24:38.895
17	SEK	Swedish Kroner	12.8300	12.8800	1	2025-02-09 05:24:38.899
18	DKK	Danish Kroner	19.4200	19.5100	1	2025-02-09 05:24:38.904
19	HKD	Hong Kong Dollar	17.9200	18.0000	1	2025-02-09 05:24:38.91
20	KWD	Kuwaity Dinar	452.2700	454.2200	1	2025-02-09 05:24:38.915
21	BHD	Bahrain Dinar	370.2700	371.8600	1	2025-02-09 05:24:38.919
22	OMR	Omani Rial	362.5600	364.1200	1	2025-02-09 05:24:38.926
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: sri
--

COPY public.transactions (transaction_id, currency_name, currency_iso_code, exchange_rate, fc_amount, commission, "NPR_amount", created_by, updated_by, transaction_type, "voucherVoucherNumber") FROM stdin;
1	Swedish Kroner	SEK	12.6600	3434.00	\N	43474.44	C100	V100	staff-voucher	1
6	U.S. Dollar	USD	138.2400	2800.00	\N	387072.00	S00583	V100	remit-out	5
7	Singapore Dollar	SGD	102.6100	500.00	\N	51305.00	S00583	V100	remit-out	5
5	Thai Baht	THB	4.1100	3444.00	\N	14154.84	C100	V100	staff-voucher	4
4	U.S. Dollar	USD	138.2400	2333.00	\N	322513.92	C100	V100	remit-out	3
2	Swiss Franc	CHF	152.7000	233.00	177.90	35579.10	C100	V100	remit-in	2
3	U.S. Dollar	USD	138.2400	133.00	\N	18385.92	C100	V100	remit-in	2
8	U.S. Dollar	USD	138.2400	500.00	345.60	69120.00	C100	V100	remit-in	6
9	U.S. Dollar	USD	138.2400	500.00	\N	69120.00	C100	V100	remit-in	7
10	U.S. Dollar	USD	138.2400	800.00	552.96	110592.00	C100	V100	remit-in	7
11	U.S. Dollar	USD	138.2400	34.00	\N	4700.16	C100	V100	remit-out	8
21	Hong Kong Dollar	HKD	17.7800	2323.00	\N	41302.94	C100	V100	remit-out	15
20	UAE Dirham	AED	37.7000	2323.00	\N	87577.10	C100	V100	remit-out	14
22	U.S. Dollar	USD	138.8800	1000.00	\N	138880.00	S00583	Y00038	remit-out	16
23	Singapore Dollar	SGD	102.3300	2000.00	\N	204660.00	S00583	Y00038	remit-out	16
24	Saudi Arabian Riyal	SAR	37.0300	100000.00	\N	3703000.00	S00583	Y00038	remit-in	17
25	U.S. Dollar	USD	138.8800	1000.00	694.40	138880.00	S00583	Y00038	remit-in	17
26	Saudi Arabian Riyal	SAR	37.0300	5000.00	925.75	185150.00	S00583	Y00038	remit-in	17
27	U.S. Dollar	USD	138.8800	1500.00	\N	208320.00	S00583	Y00038	staff-voucher	18
28	Thai Baht	THB	4.1300	5000.00	\N	20650.00	S00583	Y00038	staff-voucher	18
29	Singapore Dollar	SGD	102.3300	500.00	\N	51165.00	S00583	Y00038	staff-voucher	18
30	U.S. Dollar	USD	138.8800	1000.00	\N	138880.00	S00583	Y00038	staff-voucher	19
31	Singapore Dollar	SGD	102.3300	2000.00	\N	204660.00	S00583	Y00038	staff-voucher	19
32	Japanese Yen	JPY	0.9000	500000.00	\N	450000.00	S00583	Y00038	staff-voucher	20
33	U.S. Dollar	USD	138.8800	49999.90	\N	6943986.11	S00583	Y00038	staff-voucher	20
34	U.S. Dollar	USD	138.8800	1500.00	\N	208320.00	S00583	Y00038	remit-out	21
35	Singapore Dollar	SGD	102.3300	500.00	\N	51165.00	S00583	Y00038	remit-out	21
36	U.S. Dollar	USD	138.8800	500.00	\N	69440.00	S00583	Y00038	remit-in	22
37	U.S. Dollar	USD	138.8800	700.00	486.08	97216.00	S00583	Y00038	remit-in	22
38	Saudi Arabian Riyal	SAR	37.0300	400.01	74.06	14812.37	S00583	Y00038	remit-in	22
39	U.S. Dollar	USD	138.8800	2000.00	\N	277760.00	S00583	Y00038	staff-voucher	23
40	Qatari Riyal	QAR	38.0900	400.00	\N	15236.00	S00583	Y00038	staff-voucher	23
19	Swedish Kroner	SEK	12.6500	34.00	\N	430.10	C100	V100	remit-in	13
18	Chinese Yuan	CNY	19.0900	344.00	\N	6566.96	C100	V100	remit-out	12
16	U.S. Dollar	USD	138.4600	100.00	69.23	13846.00	C100	V100	remit-in	11
17	South Korean Won	KRW	0.1000	100000.00	\N	10000.00	C100	V100	remit-in	11
14	U.S. Dollar	USD	138.2400	1500.00	\N	207360.00	S00583	V100	remit-out	10
15	Thai Baht	THB	4.1100	50000.00	\N	205500.00	S00583	V100	remit-out	10
12	U.S. Dollar	USD	138.2400	1000.00	\N	138240.00	S00583	V100	remit-out	9
13	UK Pound Sterling	GBP	171.6800	500.00	\N	85840.00	S00583	V100	remit-out	9
42	UK Pound Sterling	GBP	172.1100	233.00	\N	40101.63	C100	V100	remit-out	25
41	U.S. Dollar	USD	138.8800	233.00	\N	32359.04	C100	V100	remit-out	24
43	Thai Baht	THB	4.1100	23232.00	\N	95483.52	C100	V100	remit-out	26
44	Thai Baht	THB	4.1100	34343.00	\N	141149.73	C100	V100	remit-out	27
45	U.S. Dollar	USD	138.8800	3434.00	\N	476913.92	C100	V100	remit-out	28
46	Swedish Kroner	SEK	12.5200	343.00	\N	4294.36	C100	V100	remit-out	29
47	Australian Dollar	AUD	86.2700	3434.00	\N	296251.18	C100	V100	remit-out	30
48	UK Pound Sterling	GBP	172.1100	2000.00	\N	344220.00	S00583	Y00038	remit-out	31
60	UAE Dirham	AED	38.1800	34.00	\N	1298.12	C100	Pending	staff-voucher	40
50	U.S. Dollar	USD	139.8000	1000.00	\N	139800.00	S00583	Y00038	remit-out	33
51	Chinese Yuan	CNY	19.2800	5000.00	\N	96400.00	S00583	Y00038	remit-out	33
52	U.S. Dollar	USD	139.8000	2000.00	\N	279600.00	S00583	Y00038	remit-out	34
53	Singapore Dollar	SGD	102.1800	500.00	\N	51090.00	S00583	Y00038	remit-out	34
49	Euro	EUR	150.5000	200.00	80.25	30100.00	S00583	V100	remit-in	32
54	Qatari Riyal	QAR	38.3000	343.00	\N	13136.90	C100	V100	remit-out	35
55	Qatari Riyal	QAR	38.3000	23.00	\N	880.90	C100	Waiting for Edit	remit-out	36
56	Indian Rupee	INR	1.6000	233.00	\N	372.80	C100	Pending	remit-out	37
61	Danish Kroner	DKK	19.5900	233.00	\N	4564.47	C100	Pending	staff-voucher	40
58	Thai Baht	THB	4.1600	34.00	0.71	141.44	C100	V100	remit-in	39
59	Malaysian Ringgit	MYR	31.5800	343.00	\N	10831.94	C100	V100	remit-in	39
62	U.S. Dollar	USD	140.2500	2500.00	\N	350625.00	S00583	Y00038	remit-out	41
64	U.S. Dollar	USD	139.6500	1000.00	698.25	139650.00	S00583	Y00038	remit-in	43
65	U.S. Dollar	USD	139.6500	500.00	\N	69825.00	S00583	Y00038	remit-in	43
66	Chinese Yuan	CNY	19.2600	150.00	\N	2889.00	P00320	J00130	remit-out	44
67	U.S. Dollar	USD	140.4300	150.00	\N	21064.50	P00320	J00130	remit-out	45
63	U.S. Dollar	USD	140.2500	2000.00	\N	280500.00	S00583	V100	remit-out	42
57	Singapore Dollar	SGD	103.9700	3443.00	\N	357968.71	C100	V100	remit-out	38
68	South Korean Won	KRW	0.1000	3434.00	\N	343.40	C100	V100	remit-out	46
69	Thai Baht	THB	4.1700	34.00	\N	141.78	C100	V100	remit-out	47
70	South Korean Won	KRW	0.1000	2323.00	\N	232.30	C100	Pending	remit-out	48
71	Saudi Arabian Riyal	SAR	37.3800	2323.00	\N	86833.74	C100	Pending	remit-out	48
72	Hong Kong Dollar	HKD	17.9200	3434.00	\N	61537.28	C100	Pending	remit-in	49
73	Thai Baht	THB	4.1500	2323.00	48.20	9640.45	C100	Pending	remit-in	49
74	Australian Dollar	AUD	88.0800	4000.00	\N	352320.00	S00583	Y00038	remit-out	50
77	U.S. Dollar	USD	140.1900	344.00	\N	48225.36	S00583	Pending	remit-out	52
75	U.S. Dollar	USD	140.1900	2000.00	\N	280380.00	S00583	Y00038	remit-out	51
76	Qatari Riyal	QAR	38.4500	5000.00	\N	192250.00	S00583	Y00038	remit-out	51
78	Qatari Riyal	QAR	38.4500	2323.00	\N	89319.35	C100	V100	remit-out	53
79	Indian Rupee	INR	1.6000	100.00	\N	160.00	S00583	Y00038	remit-out	54
80	European Euro	EUR	145.5200	100.00	\N	14552.00	S00583	Y00038	remit-out	54
81	Japanese Yen	JPY	0.9200	100.00	\N	92.00	S00583	Y00038	remit-out	54
82	Singapore Dollar	SGD	103.7700	100.00	\N	10377.00	S00583	Y00038	remit-out	54
83	U.S. Dollar	USD	140.1900	100.00	\N	14019.00	S00583	Y00038	remit-out	54
84	Canadian Dollar	CAD	97.8500	100.00	\N	9785.00	S00583	Y00038	remit-out	54
85	Australian Dollar	AUD	88.0800	100.00	\N	8808.00	S00583	Y00038	remit-out	54
86	Swiss Franc	CHF	154.5700	99.76	\N	15419.90	S00583	Y00038	remit-out	54
87	UK Pound Sterling	GBP	174.5900	100.00	\N	17459.00	S00583	Y00038	remit-out	54
88	Saudi Arabian Riyal	SAR	37.3800	100.00	\N	3738.00	S00583	Y00038	remit-out	54
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: sri
--

COPY public.users (staff_code, password, staff_name, designation, role, email, mobile_number, user_status, remarks, "createdAt", "updatedAt") FROM stdin;
SA001	$2b$12$PmTDTngquhbQtWYGoLyOye4Tu0EZHny.PnYf.t3xmpLKbVHjjsohO	Super Admin	Deputy Director	SuperAdmin	superadmin@example.com	1234567890	Enabled	SuperAdmin Account	2025-01-20 04:55:18.152722	2025-01-20 04:55:18.152722
C100	$2a$10$ilRaGOcMdp8NqSfqG9erPuHDr34yuqE1KOUA8n5QG5oTbVpAoLHky	Creator 1	Assistant	Creator	c@gmail.com	2372737372	Enabled	Enable 	2025-01-20 04:49:32.083069	2025-01-20 05:08:52.878543
Y00038	$2a$10$KBDA2mkaDhjTJLmtPXifnOc1BNdCkF7d3.VFvuDAr7.gEbYhfXbBy	Yagya Bahadur Katwal	Deputy Director	Verifier	yagyabk@nrb.org.np	9851182506	Enabled	\N	2025-01-21 05:04:50.268744	2025-01-21 05:04:50.268744
S00583	$2a$10$9cykR1XV8dQqxI1vCWcK2e4lJp4chwO0QKZd6uJQDTDIr/MgZBo8K	Suman Raj Dangol	Assistant Director	Creator	sumandangol@nrb.org.np	9851125553	Enabled	\N	2025-01-21 05:05:45.796235	2025-01-21 05:05:45.796235
V100	$2a$10$XlGESDfGjNONTMgAsH6ijuSeKvTirIAvsubZq/4fRsIQ0i5xYHgoi	Verifier 1 	Head Assistant	Verifier	v@gmail.com	3453213244	Enabled	Transfer from HRMD	2025-01-20 05:53:26.747267	2025-01-21 06:00:40.01678
g00248	$2a$10$lHCp3WqWqKcT7UqHEilFuurFGyz7Pid66UK01Z7EkWYhYdsaFKCs6	Gautam Aryal	Assistant Director	Creator	gautam@nrb	984738754	Disabled	For testing purpose	2025-01-26 05:34:49.9203	2025-01-26 05:35:42.148083
abc	$2a$10$2lVSZffzlrwelkM5HrAcROu8fKNai5ywQb/S/rJhAf0MToZRrhPWC	abc	Head Assistant	Creator	a@bb.c	0000000000	Enabled	\N	2025-01-27 04:00:19.484548	2025-01-27 04:02:44.791807
a	$2a$10$Cl20BUfhkN8xeHyr32CW8eMb2y28vlIzEYLCjD2Vq1/JOejYB7VV.	a	Deputy Director	Creator	a@a.c	aaa	Enabled	\N	2025-01-27 04:04:12.0094	2025-01-27 04:04:12.0094
a1234	$2a$10$opz13fzdVfyMu50luASrpuZNM.BmaIivNsFWdFpkgwmSRxPREAZ.G	a1234	Deputy Director	Creator	a1234@a.c	aaaaaa	Enabled	\N	2025-01-27 04:12:39.432809	2025-01-27 04:12:39.432809
a123	$2a$10$9MScfIyQuboczM6itT2guOkhwug3PtlU0waiLMuGJjVD7BwSUPXlm	a123	Deputy Director	Creator	a12345@a.c	aaaaa5	Enabled	\N	2025-01-27 04:16:17.98438	2025-01-27 04:16:17.98438
a1235	$2a$10$1NjfG2MUBROXLH0kTNjq1evyqWrbFetFVgJOG6QUX8GE6G/ir4sRO	a123	Deputy Director	Creator	a123456@a.c	aaaaa56	Enabled	\N	2025-01-27 04:18:48.638983	2025-01-27 04:18:48.638983
a1235+	$2a$10$ZS6ABXF6A3KbZT79mfNFIuLSvyZwDg.tdRoRHuCI8y8xvYSuhafMG	a123+	Deputy Director	Creator	a123456@a.c+	aaaaa56+	Enabled	\N	2025-01-27 04:27:33.211286	2025-01-27 04:27:33.211286
a1235+-	$2a$10$beAcBejXQmjP6V02VGSdz.RaoDP6bgpj1s.HjA31kdjDl/3BdJVj.	a123-+	Deputy Director	Creator	a123456@a.c+-	aaaaa56+-	Enabled	\N	2025-01-27 04:46:46.627076	2025-01-27 04:46:46.627076
a1235+1-	$2a$10$RBStldZGtKcdALQUFAK/nuQODL5Hxh8ZYOZibjbeFbZsfa9vK1AWC	a123-1+	Deputy Director	Creator	a123456a.c+-	aaaaa56+1-	Enabled	\N	2025-01-27 04:48:19.04099	2025-01-27 04:48:19.04099
C002	$2a$10$ucsB55heyw/kEt9jrPGG9uqlgzbB/5SgAOF1No3cSGscDv5IsYOuO	Creator 2	Head Assistant	Creator	c2@g.com	2373737372	Enabled	\N	2025-01-28 02:01:29.322915	2025-01-28 02:01:29.322915
V002	$2a$10$i1F33bmt5DiqDpyAIETsbeZVNQh0sTujIf6aCsr5x1SOfegGuRSWy	Verifier 2	Assistant Director	Creator	v2@g.com	2736363362	Enabled	\N	2025-01-28 02:02:13.976569	2025-01-28 02:02:13.976569
Admin	$2a$10$KCBh5WM7h7SWmj23Ly/e2u2mdzAVmL1DJphD4YQ3U6FXaAeC8lNbm	Business Admin	Deputy Director	Admin	bd@nrb.org.np	9840000000	Enabled	\N	2025-02-01 15:19:19.72763	2025-02-01 15:19:19.72763
A00191	$2a$10$aJBOVUlCJF6sFbkI402YoOeok.iQLx0w3k3oThY7Gz7DTTnH/IcAe	Bahubali	Assistant	Creator	a00191@nrb.org.np	9861800786	Disabled	FOR TEST PURPOSES	2025-02-03 07:39:17.039565	2025-02-03 07:43:28.637009
P00320	$2a$10$JNdlRuyB4ewjW3XxA2fNCu.33pPIporBdV1uQ4W5QeXCEln4hBece	Praveen Kanwar	Assistant	Creator	praveen@nrb.org.np	1234567891	Enabled	\N	2025-01-21 04:24:41.842433	2025-02-07 04:51:46.849883
J00130	$2a$10$tSqBsm6lTFL8WwTGaLphtuVtLRCWeURrxnrRHjY6ld6WevRd2LQCW	Jayshree Maharjan	Assistant	Verifier	jayshree@nrb.org.np	9876543218	Enabled	\N	2025-01-21 04:25:50.515524	2025-02-07 04:57:25.958399
\.


--
-- Data for Name: voucher; Type: TABLE DATA; Schema: public; Owner: sri
--

COPY public.voucher (voucher_number, fiscal_year, voucher_date, customer_name, voucher_staff_code, passport_number, mobile_number, customer_address, itrs_code, visiting_country, purpose_of_visit, source_of_foreign_currency, travel_order_ref_number, voucher_status, "createdBy", "updatedBy", "updatedAt", ordered_by) FROM stdin;
1	2081/82	2025-01-25 10:15:06.437626	Staff voucher check	H78788	H12321	3892429	Kathmandu	3432	\N	\N	\N	US-2321	Verified	C100	V100	2025-01-25 10:24:02.911515	\N
5	2081/82	2025-01-26 05:25:07.84115	Gautam Aryal	\N	PA1234578	9847387545	Pipaldanda Palpa	\N	United State	Personal Visit	\N	\N	Verified	S00583	V100	2025-01-26 05:26:55.489028	\N
4	2081/82	2025-01-26 03:54:13.290832	Staff	V79000	HJK7876767	786568	Kathmandu	\N	\N	\N	\N	655878	Verified	C100	V100	2025-01-26 05:39:06.647499	\N
3	2081/82	2025-01-26 03:53:27.188339	Remit-out	\N	H67667	8796768	Kathmandu	\N	US	Tour	\N	\N	Verified	C100	V100	2025-01-26 05:39:13.883931	\N
2	2081/82	2025-01-26 03:52:49.846721	Remit-in	\N	H123	7277178	Kathmandu	233	\N	\N	Income	\N	Canceled	C100	V100	2025-01-26 05:39:24.884603	\N
6	2081/82	2025-01-26 05:43:10.872029	Ram Nath Pandit	\N	PA235658	9841484959	Kathamandu, Nepal	\N	\N	\N	Foreign Visit	\N	Verified	C100	V100	2025-01-26 05:44:26.316946	\N
7	2081/82	2025-01-26 05:57:17.892865	Naresh Mandal	\N	PA34558895	9841424341	Kathmandu	\N	\N	\N	Gift	\N	Verified	C100	V100	2025-01-26 05:58:24.076532	\N
8	2081/82	2025-01-26 08:16:08.48398	New 	\N	PA1928	834798	Kathmandu	\N	United States 	Tourist	\N	\N	Verified	C100	V100	2025-01-26 08:16:46.006999	\N
15	2081/82	2025-01-28 07:02:42.259938	Approved By Check	\N	PA12331	23232	kathmandu	\N	United Arab Emirates	tour	\N	\N	Verified	C100	V100	2025-01-28 07:39:27.170363	Assistant, Name 
14	2081/82	2025-01-28 06:59:25.736052	Approved By check	\N	PA12331	348348	kathmandu	\N	United States of America	Tour	\N	\N	Canceled	C100	V100	2025-01-28 07:40:33.237821	\N
16	2081/82	2025-02-01 14:53:02.139927	Suresh Paudel	\N	PA012356	9846000000	Pokhara-30, Kaski	2133	Singapore	Personal	\N	\N	Verified	S00583	Y00038	2025-02-01 14:53:21.625054	Director, Rishi Baral
17	2081/82	2025-02-01 15:15:33.965144	Hari Sharma	\N	235648	980000000	Janakpur-10, Dhanusha	221	\N	\N	Salary	\N	Verified	S00583	Y00038	2025-02-01 15:15:57.732726	Executive Director, Vishrut Thapa
18	2081/82	2025-02-01 15:32:30.78132	A B Thapa	A00200	1213501	9854621	Kathmandu-30, Kathmandu	16522	\N	\N	\N	HRMD-FT-0021-2081/82	Verified	S00583	Y00038	2025-02-01 15:32:48.224275	Executive Director, Vishrut Thapa
19	2081/82	2025-02-01 15:41:56.39293	H K Paudel	H00300	855245	9851200000	Palpa-10, Palpa	\N	\N	\N	\N	HRMD-22033-2081/82	Verified	S00583	Y00038	2025-02-01 15:43:39.671695	Director, Rishi Baral
20	2081/82	2025-02-02 04:44:34.103915	Jay Mandal	J00100	PA021552	982000000	Siraha-10, Siraha	456456	\N	\N	\N	HRMD-100-2081/82	Verified	S00583	Y00038	2025-02-02 04:50:21.399713	Executive Director, Vishrut Thapa
21	2081/82	2025-02-02 08:50:50.076436	ABC Thapa	\N	PA98765456	986000000	Kathmando-10, Kathmandu	2345	United States of America	Travel	\N	\N	Verified	S00583	Y00038	2025-02-02 08:51:53.998159	Executive Director, Vishrut Thapa
22	2081/82	2025-02-02 09:04:55.89907	A Maharjan	\N	5678998	984324233	Bhaktapur	355	\N	\N	Salary	\N	Verified	S00583	Y00038	2025-02-02 09:05:37.542743	Director, Rishi Baral
23	2081/82	2025-02-02 09:12:01.909337	Madhav Pokharel	M00100	123456	986544	KTHMndu9856342	234	\N	\N	\N	HRMDD-001-2081/82	Verified	S00583	Y00038	2025-02-02 09:12:50.766353	Executive Director, Vishrut Thapa
13	2081/82	2025-01-28 06:33:39.049657	New	\N	PA123323	349348	kathmandu	\N	\N	\N	Income	\N	Verified	C100	V100	2025-02-03 12:57:49.607073	\N
12	2081/82	2025-01-28 06:22:54.693026	New Test	\N	PA123	8282838	Kathmandu	\N	United States of America	Tour	\N	\N	Verified	C100	V100	2025-02-03 13:00:58.542935	\N
11	2081/82	2025-01-28 04:19:14.662085	df	\N	12	9841258369	asd	10000	\N	\N	ada	\N	Verified	C100	V100	2025-02-03 13:01:09.002291	\N
10	2081/82	2025-01-27 10:07:41.202738	Srijan	\N	247209-9	9861222222	KTM	2132134	Thailand	Personal visit	\N	\N	Verified	S00583	V100	2025-02-03 13:04:07.627101	\N
9	2081/82	2025-01-26 09:24:56.186425	Gautam Aryal	\N	PA002234	9841236895	Kathmandu-10, Kathmandu	12334456	USA	Official Visit	\N	\N	Verified	S00583	V100	2025-02-03 13:22:12.134306	\N
25	2081/82	2025-02-03 13:25:15.595865	Test-again	\N	PA22323	3434	Kathmandu	\N	United Kingdom of Great Britain and Northern Ireland	Student	\N	\N	Canceled	C100	V100	2025-02-03 13:27:50.967577	k,j
24	2081/82	2025-02-03 13:24:22.629096	Test	\N	PA123	23233233	kathmandu	\N	United States of America	tour	\N	\N	Verified	C100	V100	2025-02-03 13:28:08.710728	D,S
26	2081/82	2025-02-03 13:29:06.024162	New	\N	PA1231323	23322	Kathmandu	\N	Nepal	Tourist	\N	\N	Verified	C100	V100	2025-02-03 13:29:19.900703	kasd,er
27	2081/82	2025-02-03 13:31:12.817843	Hello	\N	Pa232323	23	d	\N	Indonesia	t	\N	\N	Verified	C100	V100	2025-02-03 13:31:25.625507	ksd,sd
28	2081/82	2025-02-03 13:34:37.341459	test	\N	sf	23	sfdsf	\N	Andorra	sdf	\N	\N	Verified	C100	V100	2025-02-03 13:39:59.652238	dsf
29	2081/82	2025-02-03 13:46:14.043349	NEW	\N	dkf	34	kjdfj	\N	Djibouti	df	\N	\N	Verified	C100	V100	2025-02-03 13:52:35.835223	e
30	2081/82	2025-02-03 13:55:03.437868	Cancle	\N	34jfa	434	skd	\N	Japan	tour	\N	\N	Canceled	C100	V100	2025-02-03 14:03:14.070312	we
31	2081/82	2025-02-03 14:03:58.122681	B Thapa	\N	PA21541	9841521002	Kathmandu	14522	United Kingdom of Great Britain and Northern Ireland	Tourism	\N	\N	Canceled	S00583	Y00038	2025-02-03 14:04:51.653397	Executive Director, V Thapa
40	2081/82	2025-02-06 07:18:52.322677	Namr	SA0012	PA1221	987544145	Kathmandu	1234	\N	\N	\N	Tordedr	Edit	C100	Pending	2025-02-06 07:19:04.551454	Orddered Section
33	2081/82	2025-02-04 07:33:23.802841	Jay Mandal	\N	PA021552	982000000	Siraha-10, Siraha	456456	China	Tourism	\N	\N	Canceled	S00583	Y00038	2025-02-04 07:34:51.801004	Dir R Baral
34	2081/82	2025-02-04 07:40:21.261075	Sanjay Mishra	\N	PA45212	9845120122	Bhaktapur-1, Bhaktapur	1232	New Zealand	Student	\N	\N	Verified	S00583	Y00038	2025-02-04 07:40:31.464459	Dir, R Baral
32	2081/82	2025-02-03 14:07:34.334592	new_name	\N	wef	ewf	wef	\N	\N	\N	ewf	\N	Verified	S00583	V100	2025-02-05 05:24:03.136959	wef
35	2081/82	2025-02-05 04:24:12.079592	Edit	\N	ksd	34	ksd	\N	United Arab Emirates	tour	\N	\N	Canceled	C100	V100	2025-02-05 06:13:34.095222	fn
36	2081/82	2025-02-05 06:19:30.014199	Edit 2 	\N	isd2	343	djs	\N	Nepal	d	\N	\N	Edit	C100	Waiting for Edit	2025-02-05 06:28:06.890354	d
37	2081/82	2025-02-05 06:47:40.287516	Check2	\N	Ps	434	nds	\N	Nepal	dj	\N	\N	Edit	C100	Pending	2025-02-05 06:47:58.47551	dj
41	2081/82	2025-02-06 17:38:17.376519	Manoj Khadka 	\N	PA021512	984512032	Lokanthali-01, Bhaktapur	123456	United States of America	Tourism	\N	\N	Canceled	S00583	Y00038	2025-02-06 17:40:49.350677	Director, Rishi Baral
38	2081/82	2025-02-06 06:26:47.536878	Name changed again for status	\N	Passport number changed	38383838	address Changed	\N	Nepal	Purpose changed	\N	\N	Verified	C100	V100	2025-02-08 14:06:50.255051	sd
39	2081/82	2025-02-06 06:54:56.507662	Transaction changed with comission	\N	djs	987	jds	\N	\N	\N	usd	\N	Verified	C100	V100	2025-02-06 16:18:25.402335	djs
43	2081/82	2025-02-06 17:45:09.200435	Manoj Khadka	\N	PA01235	584564	Loka	122	\N	\N	Cancel Trip	\N	Verified	S00583	Y00038	2025-02-06 17:46:20.071458	Dir
44	2081/82	2025-02-07 04:56:46.645692	Naresh Mandal	\N	1234	980000	ktm	\N	China	Official Visit	\N	\N	Verified	P00320	J00130	2025-02-07 05:01:35.548167	-
45	2081/82	2025-02-07 05:04:49.45157	Rajesh Chobe	\N	1234	9800000	Ktm	\N	Angola	Official Visit	\N	\N	Verified	P00320	J00130	2025-02-07 05:11:48.922289	-
42	2081/82	2025-02-06 17:42:34.083618	Manoj Khadka	\N	PA012346	985412360	Lokanthali-01, Bhaktapur	123	United States of America	Tourism	\N	\N	Verified	S00583	V100	2025-02-08 14:04:32.685186	Director, Rishi Baral
46	2081/82	2025-02-08 14:09:12.815706	neww	\N	asd	33232	23asd	\N	Andorra	asd	\N	\N	Verified	C100	V100	2025-02-08 14:09:38.314099	sad
47	2081/82	2025-02-08 14:10:49.502431	test refresh	\N	skdj`	343	sakdja	\N	Nepal	sd	\N	\N	Canceled	C100	V100	2025-02-08 14:11:03.044586	sfs
48	2081/82	2025-02-08 14:13:37.832354	Edit check	\N	Pa12323	3434	Kathmandi	\N	Nepal	tour 	\N	\N	Edit	C100	Pending	2025-02-08 14:13:57.271492	sjd
49	2081/82	2025-02-08 14:14:59.457573	check again	\N	asdads	3434	Kathmandu	\N	\N	\N	incomw	\N	Edit	C100	Pending	2025-02-08 14:16:53.615355	skd
50	2081/82	2025-02-09 04:35:25.108259	Sanjay Mishra	\N	PA45212	9845120122	Bhaktapur-1, Bhaktapur	1232	Australia	Student	\N	\N	Verified	S00583	Y00038	2025-02-09 04:36:41.099644	Dir, R Baral
52	2081/82	2025-02-09 04:40:14.286352	abhi	\N	re	896	ret	67876	Anguilla	ryt	\N	\N	Pending	S00583	Pending	2025-02-09 04:40:14.286352	mgh
51	2081/82	2025-02-09 04:38:39.268034	Jay Mandal	\N	87879	98442011	Siraha-10, Siraha	456456	Argentina	Tourism	\N	\N	Verified	S00583	Y00038	2025-02-09 04:40:56.725128	Dir R Baral
53	2081/82	2025-02-09 05:21:15.812576	Name	\N	Pa123`	23211231	Kathmaduu	\N	India	tour	\N	\N	Verified	C100	V100	2025-02-09 05:21:59.532741	des
54	2081/82	2025-02-09 06:17:52.103911	Test of limit 	\N	PA123232	123456789	Kathmandu	\N	Nepal	tour	\N	\N	Verified	S00583	Y00038	2025-02-09 06:19:00.518216	Post
\.


--
-- Name: exchange_rates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sri
--

SELECT pg_catalog.setval('public.exchange_rates_id_seq', 22, true);


--
-- Name: transactions_transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sri
--

SELECT pg_catalog.setval('public.transactions_transaction_id_seq', 88, true);


--
-- Name: exchange_rates PK_33a614bad9e61956079d817ebe2; Type: CONSTRAINT; Schema: public; Owner: sri
--

ALTER TABLE ONLY public.exchange_rates
    ADD CONSTRAINT "PK_33a614bad9e61956079d817ebe2" PRIMARY KEY (id);


--
-- Name: transactions PK_9162bf9ab4e31961a8f7932974c; Type: CONSTRAINT; Schema: public; Owner: sri
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT "PK_9162bf9ab4e31961a8f7932974c" PRIMARY KEY (transaction_id);


--
-- Name: users PK_a777ab5d52aedf484341c025219; Type: CONSTRAINT; Schema: public; Owner: sri
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a777ab5d52aedf484341c025219" PRIMARY KEY (staff_code);


--
-- Name: voucher PK_f14c66ff859e12e07a36082219b; Type: CONSTRAINT; Schema: public; Owner: sri
--

ALTER TABLE ONLY public.voucher
    ADD CONSTRAINT "PK_f14c66ff859e12e07a36082219b" PRIMARY KEY (voucher_number);


--
-- Name: users UQ_350c2c34c6fdd4b292ab6e77879; Type: CONSTRAINT; Schema: public; Owner: sri
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_350c2c34c6fdd4b292ab6e77879" UNIQUE (mobile_number);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: sri
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: transactions FK_59185dd56de57e7c31e296cb74f; Type: FK CONSTRAINT; Schema: public; Owner: sri
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT "FK_59185dd56de57e7c31e296cb74f" FOREIGN KEY ("voucherVoucherNumber") REFERENCES public.voucher(voucher_number);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO sri;


--
-- PostgreSQL database dump complete
--

