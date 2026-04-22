--
-- PostgreSQL database dump
--

\restrict ZWTGPPWo9RSv6krORJf1MYoIqvKICLQZFLJ1Wc70d65q5tzrmRgaIXgOBXBzGQa

-- Dumped from database version 17.9 (Debian 17.9-1.pgdg13+1)
-- Dumped by pg_dump version 17.9 (Ubuntu 17.9-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: event_category_enum; Type: TYPE; Schema: public; Owner: eraicode
--

CREATE TYPE public.event_category_enum AS ENUM (
    'Camp',
    'Retreat',
    'Quarterly',
    'Monthly',
    'Special'
);


ALTER TYPE public.event_category_enum OWNER TO eraicode;

--
-- Name: event_role_enum; Type: TYPE; Schema: public; Owner: eraicode
--

CREATE TYPE public.event_role_enum AS ENUM (
    'Peserta',
    'Panitia',
    'Volunteer'
);


ALTER TYPE public.event_role_enum OWNER TO eraicode;

--
-- Name: gender_enum; Type: TYPE; Schema: public; Owner: eraicode
--

CREATE TYPE public.gender_enum AS ENUM (
    'Laki-laki',
    'Perempuan'
);


ALTER TYPE public.gender_enum OWNER TO eraicode;

--
-- Name: keterangan_enum; Type: TYPE; Schema: public; Owner: eraicode
--

CREATE TYPE public.keterangan_enum AS ENUM (
    'hadir',
    'izin',
    'tidak_hadir',
    'tamu'
);


ALTER TYPE public.keterangan_enum OWNER TO eraicode;

--
-- Name: member_status_enum; Type: TYPE; Schema: public; Owner: eraicode
--

CREATE TYPE public.member_status_enum AS ENUM (
    'Active',
    'Inactive',
    'Sabbatical',
    'Moved'
);


ALTER TYPE public.member_status_enum OWNER TO eraicode;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _migrations; Type: TABLE; Schema: public; Owner: eraicode
--

CREATE TABLE public._migrations (
    id integer NOT NULL,
    filename character varying(255) NOT NULL,
    applied_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public._migrations OWNER TO eraicode;

--
-- Name: _migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: eraicode
--

CREATE SEQUENCE public._migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public._migrations_id_seq OWNER TO eraicode;

--
-- Name: _migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eraicode
--

ALTER SEQUENCE public._migrations_id_seq OWNED BY public._migrations.id;


--
-- Name: cgf_attendance; Type: TABLE; Schema: public; Owner: eraicode
--

CREATE TABLE public.cgf_attendance (
    id integer NOT NULL,
    no_jemaat integer NOT NULL,
    cg_id character varying(5) NOT NULL,
    tanggal date NOT NULL,
    keterangan public.keterangan_enum NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.cgf_attendance OWNER TO eraicode;

--
-- Name: cgf_attendance_id_seq; Type: SEQUENCE; Schema: public; Owner: eraicode
--

CREATE SEQUENCE public.cgf_attendance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cgf_attendance_id_seq OWNER TO eraicode;

--
-- Name: cgf_attendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eraicode
--

ALTER SEQUENCE public.cgf_attendance_id_seq OWNED BY public.cgf_attendance.id;


--
-- Name: cgf_info; Type: TABLE; Schema: public; Owner: eraicode
--

CREATE TABLE public.cgf_info (
    id character varying(5) NOT NULL,
    nama_cgf character varying(255) NOT NULL,
    lokasi_1 character varying(255) NOT NULL,
    lokasi_2 character varying(255),
    hari character varying(10) NOT NULL
);


ALTER TABLE public.cgf_info OWNER TO eraicode;

--
-- Name: cgf_members; Type: TABLE; Schema: public; Owner: eraicode
--

CREATE TABLE public.cgf_members (
    no_jemaat integer NOT NULL,
    nama_jemaat character varying(255) NOT NULL,
    nama_cgf character varying(100),
    no_handphone character varying(20),
    is_leader boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.cgf_members OWNER TO eraicode;

--
-- Name: cnx_jemaat_baru; Type: TABLE; Schema: public; Owner: eraicode
--

CREATE TABLE public.cnx_jemaat_baru (
    jemaat_baru_id integer NOT NULL,
    "timestamp" date,
    nama_jemaat character varying(50),
    jenis_kelamin character varying(50),
    tanggal_lahir date,
    tahun_lahir integer,
    bulan_lahir integer,
    kuliah_kerja character varying(50),
    no_handphone character varying(50),
    ketertarikan_cgf character varying(50),
    nama_cgf character varying(50),
    kategori_domisili character varying(50),
    alamat_domisili character varying
);


ALTER TABLE public.cnx_jemaat_baru OWNER TO eraicode;

--
-- Name: cnx_jemaat_clean; Type: TABLE; Schema: public; Owner: eraicode
--

CREATE TABLE public.cnx_jemaat_clean (
    no_jemaat integer NOT NULL,
    nama_jemaat character varying(50),
    jenis_kelamin character varying(50),
    tanggal_lahir date,
    tahun_lahir integer,
    bulan_lahir integer,
    kuliah_kerja character varying(50),
    no_handphone character varying(50),
    ketertarikan_cgf character varying(50),
    nama_cgf character varying(50),
    kategori_domisili character varying(50),
    alamat_domisili character varying,
    status_aktif text,
    status_keterangan text
);


ALTER TABLE public.cnx_jemaat_clean OWNER TO eraicode;

--
-- Name: cnx_jemaat_csv; Type: TABLE; Schema: public; Owner: eraicode
--

CREATE TABLE public.cnx_jemaat_csv (
    no_jemaat integer NOT NULL,
    nama_jemaat character varying(50),
    jenis_kelamin character varying(50),
    tanggal_lahir character varying(50),
    alamat_domisili character varying,
    kuliah_kerja character varying(50),
    no_handphone character varying(50),
    ketertarikan_cgf character varying(50),
    nama_cgf character varying(50)
);


ALTER TABLE public.cnx_jemaat_csv OWNER TO eraicode;

--
-- Name: cnx_jemaat_status_history; Type: TABLE; Schema: public; Owner: eraicode
--

CREATE TABLE public.cnx_jemaat_status_history (
    id integer NOT NULL,
    no_jemaat integer NOT NULL,
    status public.member_status_enum NOT NULL,
    changed_at timestamp without time zone DEFAULT now(),
    reason text
);


ALTER TABLE public.cnx_jemaat_status_history OWNER TO eraicode;

--
-- Name: cnx_jemaat_status_history_id_seq; Type: SEQUENCE; Schema: public; Owner: eraicode
--

CREATE SEQUENCE public.cnx_jemaat_status_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cnx_jemaat_status_history_id_seq OWNER TO eraicode;

--
-- Name: cnx_jemaat_status_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eraicode
--

ALTER SEQUENCE public.cnx_jemaat_status_history_id_seq OWNED BY public.cnx_jemaat_status_history.id;


--
-- Name: event_history; Type: TABLE; Schema: public; Owner: eraicode
--

CREATE TABLE public.event_history (
    event_id integer NOT NULL,
    event_name character varying(255) NOT NULL,
    event_date date NOT NULL,
    category public.event_category_enum NOT NULL,
    location character varying(255),
    description text,
    gcal_event_id character varying(255),
    gcal_link text,
    last_synced_at timestamp with time zone
);


ALTER TABLE public.event_history OWNER TO eraicode;

--
-- Name: event_history_event_id_seq; Type: SEQUENCE; Schema: public; Owner: eraicode
--

CREATE SEQUENCE public.event_history_event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.event_history_event_id_seq OWNER TO eraicode;

--
-- Name: event_history_event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eraicode
--

ALTER SEQUENCE public.event_history_event_id_seq OWNED BY public.event_history.event_id;


--
-- Name: event_participation; Type: TABLE; Schema: public; Owner: eraicode
--

CREATE TABLE public.event_participation (
    id integer NOT NULL,
    event_id integer NOT NULL,
    no_jemaat integer NOT NULL,
    role public.event_role_enum DEFAULT 'Peserta'::public.event_role_enum NOT NULL,
    registered_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.event_participation OWNER TO eraicode;

--
-- Name: event_participation_id_seq; Type: SEQUENCE; Schema: public; Owner: eraicode
--

CREATE SEQUENCE public.event_participation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.event_participation_id_seq OWNER TO eraicode;

--
-- Name: event_participation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eraicode
--

ALTER SEQUENCE public.event_participation_id_seq OWNED BY public.event_participation.id;


--
-- Name: pelayan; Type: TABLE; Schema: public; Owner: eraicode
--

CREATE TABLE public.pelayan (
    no_jemaat integer NOT NULL,
    nama_jemaat character varying(255) NOT NULL,
    is_wl smallint DEFAULT 0,
    is_singer smallint DEFAULT 0,
    is_pianis smallint DEFAULT 0,
    is_saxophone smallint DEFAULT 0,
    is_filler smallint DEFAULT 0,
    is_bass_gitar smallint DEFAULT 0,
    is_drum smallint DEFAULT 0,
    is_mulmed smallint DEFAULT 0,
    is_sound smallint DEFAULT 0,
    is_caringteam smallint DEFAULT 0,
    is_connexion_crew smallint DEFAULT 0,
    is_supporting_crew smallint DEFAULT 0,
    is_cforce smallint DEFAULT 0,
    is_cg_leader smallint DEFAULT 0,
    is_community_pic smallint DEFAULT 0,
    is_others smallint DEFAULT 0,
    total_pelayanan integer DEFAULT 0
);


ALTER TABLE public.pelayan OWNER TO eraicode;

--
-- Name: pelayanan_info; Type: TABLE; Schema: public; Owner: eraicode
--

CREATE TABLE public.pelayanan_info (
    pelayanan_id character varying(5) NOT NULL,
    nama_pelayanan character varying(255) NOT NULL
);


ALTER TABLE public.pelayanan_info OWNER TO eraicode;

--
-- Name: _migrations id; Type: DEFAULT; Schema: public; Owner: eraicode
--

ALTER TABLE ONLY public._migrations ALTER COLUMN id SET DEFAULT nextval('public._migrations_id_seq'::regclass);


--
-- Name: cgf_attendance id; Type: DEFAULT; Schema: public; Owner: eraicode
--

ALTER TABLE ONLY public.cgf_attendance ALTER COLUMN id SET DEFAULT nextval('public.cgf_attendance_id_seq'::regclass);


--
-- Name: cnx_jemaat_status_history id; Type: DEFAULT; Schema: public; Owner: eraicode
--

ALTER TABLE ONLY public.cnx_jemaat_status_history ALTER COLUMN id SET DEFAULT nextval('public.cnx_jemaat_status_history_id_seq'::regclass);


--
-- Name: event_history event_id; Type: DEFAULT; Schema: public; Owner: eraicode
--

ALTER TABLE ONLY public.event_history ALTER COLUMN event_id SET DEFAULT nextval('public.event_history_event_id_seq'::regclass);


--
-- Name: event_participation id; Type: DEFAULT; Schema: public; Owner: eraicode
--

ALTER TABLE ONLY public.event_participation ALTER COLUMN id SET DEFAULT nextval('public.event_participation_id_seq'::regclass);


--
-- Data for Name: _migrations; Type: TABLE DATA; Schema: public; Owner: eraicode
--

COPY public._migrations (id, filename, applied_at) FROM stdin;
1	001_create_tables.sql	2026-04-06 16:33:05.124609
2	002_create_indexes.sql	2026-04-06 16:33:05.25196
3	003_add_missing_tables.sql	2026-04-06 16:33:05.545413
4	004_add_gcal_columns_to_events.sql	2026-04-12 16:33:34.536943
\.


--
-- Data for Name: cgf_attendance; Type: TABLE DATA; Schema: public; Owner: eraicode
--

COPY public.cgf_attendance (id, no_jemaat, cg_id, tanggal, keterangan, created_at) FROM stdin;
65	75	80006	2026-04-04	hadir	2026-04-14 08:37:08.796556
\.


--
-- Data for Name: cgf_info; Type: TABLE DATA; Schema: public; Owner: eraicode
--

COPY public.cgf_info (id, nama_cgf, lokasi_1, lokasi_2, hari) FROM stdin;
80001	Cornerstone	BSD	\N	Kamis
80002	Sabbath	BSD	\N	Minggu
80003	Grace	Gading Serpong	\N	Jumat
80004	Miracle	Villa Melati Mas	Alam Sutera	Jumat
80005	Pathway	Gading Serpong	BSD	Jumat
80006	Peace	BSD	Gading Serpong	Jumat
80007	Faith	BSD	Gading Serpong	Sabtu
80008	Light	BSD	\N	Jumat
\.


--
-- Data for Name: cgf_members; Type: TABLE DATA; Schema: public; Owner: eraicode
--

COPY public.cgf_members (no_jemaat, nama_jemaat, nama_cgf, no_handphone, is_leader, created_at) FROM stdin;
12	Alvina Rotua Maharani Tambunan	Cornerstone	081211630473	t	2026-03-25 11:35:11.166612
21	Antony Dinata	Miracle	082210198810	f	2026-03-25 11:35:11.166612
22	Ardi Wiriadinata	Light	081355132068	f	2026-03-25 11:35:11.166612
23	Ardya Kristina	Miracle	087871951980	f	2026-03-25 11:35:11.166612
24	Ariel Vito Suyata Ong	Cornerstone	082283712292	f	2026-03-25 11:35:11.166612
25	Armand Pantouw	Light	0811969632	t	2026-03-25 11:35:11.166612
29	Axel Kanata	Sabbath	0895602299239	f	2026-03-25 11:35:11.166612
30	Ayu Aprilia	Miracle	08111388069	f	2026-03-25 11:35:11.166612
31	Bella Kumalasari	Miracle	081283728738	f	2026-03-25 11:35:11.166612
33	Betania	Faith	0895801422709	f	2026-03-25 11:35:11.166612
35	Bimo Adji Prasetyo	Light	085718141825	t	2026-03-25 11:35:11.166612
41	Caroline Avery Tanto	Faith	085210037800	f	2026-03-25 11:35:11.166612
43	Cecilia Verna Wijaya	Miracle	081296366520	f	2026-03-25 11:35:11.166612
46	Charissa Wicaksana	Cornerstone	081399210495	f	2026-03-25 11:35:11.166612
51	Christina Marsela	Cornerstone	085314528899	f	2026-03-25 11:35:11.166612
52	Christopher Eben Kurniawan	Cornerstone	087809080019	f	2026-03-25 11:35:11.166612
54	Christy Nathania	Miracle	089602852821	f	2026-03-25 11:35:11.166612
56	Clarisa Manuela	Pathaway	08111000569	f	2026-03-25 11:35:11.166612
57	Classico Joydie Sumendap	Peace	085157078122	f	2026-03-25 11:35:11.166612
58	Claudia Arantha	Cornerstone	087774054420	f	2026-03-25 11:35:11.166612
63	Daniel Kho	Pathaway	081388702830	f	2026-03-25 11:35:11.166612
68	Debora Emmanuel	Pathaway	081585090800	f	2026-03-25 11:35:11.166612
71	Diego Tristan	Peace	089529031056	f	2026-03-25 11:35:11.166612
75	Edward Renaldi	Peace	081289686449	t	2026-03-25 11:35:11.166612
81	Elizabeth Jenny Trixie	Cornerstone	085770832323	f	2026-03-25 11:35:11.166612
83	Emilius Filibertsus Lisiender	Pathaway	081383739491	f	2026-03-25 11:35:11.166612
85	Emmanuel Gultom	Miracle	0821042646580	f	2026-03-25 11:35:11.166612
86	Epseen	Sabbath	082136955686	f	2026-03-25 11:35:11.166612
88	Ernest Manuel Sowandi	Miracle	085880699608	f	2026-03-25 11:35:11.166612
89	Eunice Nahiman Turjono	Miracle	081908081360	f	2026-03-25 11:35:11.166612
92	Feby Angelica Soewandono	Pathaway	089605336530	t	2026-03-25 11:35:11.166612
93	Fei Elita	Cornerstone	085885338105	f	2026-03-25 11:35:11.166612
95	Felicia Sarah Wijaya	Miracle	083813659041	f	2026-03-25 11:35:11.166612
105	Gabriel Trifajar Siahaan	Light	081219856349	f	2026-03-25 11:35:11.166612
107	Gabriella Rose Gunadi	Light	089655501721	f	2026-03-25 11:35:11.166612
108	Gabrielle Budiman - Gaby	Sabbath	08117496090	f	2026-03-25 11:35:11.166612
109	Gabrielle Priskila	Cornerstone	087881729400	f	2026-03-25 11:35:11.166612
110	Geraldy Edson Thamrin	Miracle	087710920323	f	2026-03-25 11:35:11.166612
112	Giovanni Hutagaol	Pathaway	085886095554	f	2026-03-25 11:35:11.166612
115	Glory Amadea Swabawa	Miracle	089661255764	f	2026-03-25 11:35:11.166612
119	Gracia Hardjasa	Light	085929850627	f	2026-03-25 11:35:11.166612
120	Gustin Finnegan	Miracle	089698254298	f	2026-03-25 11:35:11.166612
126	Helen Ruth	Miracle	06586219393	f	2026-03-25 11:35:11.166612
127	Helena Agnes	Miracle	081388125533	f	2026-03-25 11:35:11.166612
128	Henokh Ekklesia	Cornerstone	085716806559	f	2026-03-25 11:35:11.166612
130	Indah Marshanda	Peace	\N	f	2026-03-25 11:35:11.166612
133	Irene Jovita	Light	082233595495	f	2026-03-25 11:35:11.166612
136	Jackie Leonardy	Miracle	085386343638	f	2026-03-25 11:35:11.166612
137	Jacob Alianto	Cornerstone	081977117106	f	2026-03-25 11:35:11.166612
139	Janet Christy	Miracle	085719115789	f	2026-03-25 11:35:11.166612
140	Janice Adley	Pathaway	085155119742	f	2026-03-25 11:35:11.166612
142	Jasmine Fidelia Chandra	Faith	081319007980	f	2026-03-25 11:35:11.166612
147	Jason Subandi	Peace	08111325858	f	2026-03-25 11:35:11.166612
151	Jeprijal Bamen	Cornerstone	085337245353	f	2026-03-25 11:35:11.166612
156	Jessica Octavia	Miracle	085781084400	f	2026-03-25 11:35:11.166612
158	Jessica Alberti Lowell	Peace	08812388989	f	2026-03-25 11:35:11.166612
159	Jessy Clarissa Wijaya	Peace	08151810000	f	2026-03-25 11:35:11.166612
160	Joan	Cornerstone	081318372764	f	2026-03-25 11:35:11.166612
161	Joan Amanda Moningka Wijaya	Peace	081547318105	f	2026-03-25 11:35:11.166612
163	Joel Sebastian H	Sabbath	08871336092	f	2026-03-25 11:35:11.166612
166	Jonathan Aaron Wijaya	Peace	085738808893	t	2026-03-25 11:35:11.166612
169	Jonathan Widi Cahyadi	Miracle	081212140388	f	2026-03-25 11:35:11.166612
174	Josh Marvel Nathan	Cornerstone	087873014204	f	2026-03-25 11:35:11.166612
175	Joshua Renaldo	Miracle	085280315906	f	2026-03-25 11:35:11.166612
176	Josia Joseph Chandra	Sabbath	\N	f	2026-03-25 11:35:11.166612
187	Kenneth Chuhairy	Miracle	0817862555	f	2026-03-25 11:35:11.166612
188	Kerfin	Miracle	089530442023	f	2026-03-25 11:35:11.166612
189	Kerlvin Liecarles	Pathaway	082210832397	f	2026-03-25 11:35:11.166612
192	Kezia Angeline	Light	082210902001	f	2026-03-25 11:35:11.166612
194	Kimberly	Miracle	014243957481	f	2026-03-25 11:35:11.166612
193	Kezia Putri Deo	Faith	087796164664	f	2026-03-25 11:35:11.166612
197	Luckemeraldo Jardel	Faith	081217378890	f	2026-03-25 11:35:11.166612
202	Marcelino	Peace	081388509442	f	2026-03-25 11:35:11.166612
205	Maura Sukamto	Cornerstone	017088826915	f	2026-03-25 11:35:11.166612
207	Megan Evangeline	Peace	08195588559	f	2026-03-25 11:35:11.166612
209	Merfin	Miracle	089632001951	f	2026-03-25 11:35:11.166612
218	Naditta Hutagaol	Faith	085591744749	f	2026-03-25 11:35:11.166612
219	Naftali Brigitta Gunawan	Light	081282631726	f	2026-03-25 11:35:11.166612
220	Naomi Krisanty	Peace	085885105106	f	2026-03-25 11:35:11.166612
233	Osbert Nathaniel Wibowo	Pathaway	085881698702	f	2026-03-25 11:35:11.166612
234	Oswin Suwandi	Miracle	087771777154	f	2026-03-25 11:35:11.166612
240	Paulus Adi Wau	Light	0895635020257	f	2026-03-25 11:35:11.166612
244	Primuadi Bali	Sabbath	082311634560	f	2026-03-25 11:35:11.166612
245	Putri Kasiman	Faith	087867583546	f	2026-03-25 11:35:11.166612
255	Sam	Pathaway	081316007035	f	2026-03-25 11:35:11.166612
7	Alexandra Madeline Rachel Boham	Faith	081212376714	f	2026-03-25 11:35:11.166612
9	Alicia Natasha Dynanty	Cornerstone	081293576622	f	2026-03-25 11:35:11.166612
11	Alphasius Omega Dixon	Cornerstone	081806167758	f	2026-03-25 11:35:11.166612
257	Sean Arden	Cornerstone	08161399363	f	2026-03-25 11:35:11.166612
270	Thelissa Levana Zheng	Pathaway	081806411504	f	2026-03-25 11:35:11.166612
273	Timothy Frederick Lukas	Miracle	0817136270	f	2026-03-25 11:35:11.166612
276	Timotius Aubriel	Cornerstone	0821227354080	t	2026-03-25 11:35:11.166612
277	Trissa Lonyka	Light	082112507795	f	2026-03-25 11:35:11.166612
279	Valentino Imanuel	Sabbath	085692244891	f	2026-03-25 11:35:11.166612
282	Vanesa	Miracle	08990168893	f	2026-03-25 11:35:11.166612
284	Vanessa Evelyn Thamrin	Pathaway	081808662121	f	2026-03-25 11:35:11.166612
289	Vidrey	Cornerstone	082124202722	f	2026-03-25 11:35:11.166612
291	Vieta Santoso	Miracle	081297766377	f	2026-03-25 11:35:11.166612
292	Vincent Leonardo	Miracle	081381818084	f	2026-03-25 11:35:11.166612
299	Wahyu Wijaya	Faith	0817271369	t	2026-03-25 11:35:11.166612
302	William Handel Lowry	Cornerstone	082253091274	f	2026-03-25 11:35:11.166612
303	Win Tjen	Faith	081285001187	f	2026-03-25 11:35:11.166612
306	Wynner Rafaelle	Pathaway	087881200862	f	2026-03-25 11:35:11.166612
307	Wynona	Faith	081910470450	f	2026-03-25 11:35:11.166612
1	Abraham Christopher Elgrego	Pathaway	081338245611	f	2026-03-25 11:35:11.166612
2	Accoladea Wijaya	Light	0895353279881	f	2026-03-25 11:35:11.166612
3	Agata Fortuna	Miracle	08115788772	f	2026-03-25 11:35:11.166612
129	Hubert Tatra	Cornerstone	08117572378	f	2026-03-25 11:35:11.166612
249	Riandy W	Cornerstone	\N	f	2026-03-25 11:35:11.166612
251	Ruth Yura Gracia Gultom	Miracle	081289480600	f	2026-03-25 11:35:11.166612
309	Yoel Cavello	Cornerstone	089679657452	f	2026-03-25 11:35:11.166612
311	Yosafat Hans Wijaya	Miracle	0895336787578	t	2026-03-25 11:35:11.166612
\.


--
-- Data for Name: cnx_jemaat_baru; Type: TABLE DATA; Schema: public; Owner: eraicode
--

COPY public.cnx_jemaat_baru (jemaat_baru_id, "timestamp", nama_jemaat, jenis_kelamin, tanggal_lahir, tahun_lahir, bulan_lahir, kuliah_kerja, no_handphone, ketertarikan_cgf, nama_cgf, kategori_domisili, alamat_domisili) FROM stdin;
8	2024-09-08	Gabrielle Priskila	Perempuan	1998-07-28	1998	7	Kerja	087881729400	Tidak Diisi	Cornerstone	BSD	Kencana Loka
25	2024-11-24	Jason Santoso	Laki-laki	\N	\N	\N	Tidak Diisi	087878000235	Tidak Diisi	Belum CGF	Gading Serpong	Pondok Hijau Golf, Gading Serpong
27	2024-11-24	Gabriela Megumi Kristian	Perempuan	2006-04-28	2006	4	Kuliah	085183162804	Mau Join	Belum CGF	Gading Serpong	Ruko Newton Barat no 1, Gading Serping
28	2024-12-08	Felix Nathaniel Surjodinoto	Laki-laki	2005-01-05	2005	1	Kuliah	08111092251	Mau Join	Miracle	Villa Melati Mas	Villa Melati Mas Blok H7/12A
29	2025-01-05	Septawon	Laki-laki	1999-09-06	1999	9	Tidak Diisi	0812544230549	Tidak Diisi	Belum CGF	Gading Serpong	Serpong
30	2025-01-12	Kathleen Lauren Wahyudo	Perempuan	2006-09-11	2006	9	Kuliah	088808492655	Mau Join	Belum CGF	Gading Serpong	Serpong Park F1/38 
31	2025-01-12	Michelle Caroline Obaja	Perempuan	2006-10-04	2006	10	Kuliah	081213654097	Mau Join	Belum CGF	Gading Serpong	Jalan Taman Beryl No. 9, Cluster Beryl, Gading Serpong
32	2025-01-12	Elaine Natalia Parulian Tampubolon	Perempuan	2006-12-25	2006	12	Kuliah	0816944211	Mau Join	Belum CGF	Gading Serpong	Serpong Green Park blok L, no. 3AB
33	2025-01-12	Agata Fortuna	Perempuan	1998-04-21	1998	4	Kerja	08115788772	Mau Join	Belum CGF	Gading Serpong	Tabebuya inspirahaus f5 no 10
34	2025-01-12	Michelle Gwylyn Wijaya	Perempuan	2001-04-08	2001	4	Kerja	081212870970	Mau Join	Belum CGF	Villa Melati Mas	VMM
35	2025-01-12	Ferdinand Wijaya Chandra	Laki-laki	2001-02-14	2001	2	Kerja	08988396121	Mau Join	Belum CGF	Villa Melati Mas	Villa melati
36	2025-01-12	Ancillia Wijaya	Perempuan	1999-06-17	1999	6	Kerja	082213620637	Belum Mau Join	Belum CGF	Villa Melati Mas	Villa Melati Mas Blok I 11 No. 56
37	2025-01-12	Vioren Defika	Perempuan	2002-05-16	2002	5	Kerja	081289939877	Belum Mau Join	Belum CGF	Gading Serpong	Gading Serpong
38	2025-01-12	Felicia Natalie	Perempuan	1997-11-28	1997	11	Kerja	081212488104	Mau Join	Belum CGF	Villa Melati Mas	Villa Melati Mas H7/12A
39	2025-01-12	Josephine Kalista Utomo	Perempuan	1999-11-21	1999	11	Kuliah	087879112002	Belum Mau Join	Belum CGF	Others	Lippo Cikarang
40	2025-01-12	Nicola Melodyta Suryodinoto	Perempuan	2002-01-14	2002	1	Kerja	089502506000	Mau Join	Belum CGF	BSD	BSD Sektor 1-2, Jl. Magnolia 4 blok F no.7
41	2025-01-12	Mona Sinaga	Perempuan	1988-12-19	1988	12	Kerja	085312849171	Mau Join	Belum CGF	Others	jalan ciater raya blok c nomor 11
42	2025-01-19	Johnny	Laki-laki	1993-07-29	1993	7	Kerja	085703355529	Belum Mau Join	Belum CGF	Others	Jalan Guru Mughni, Gang Andil 6
43	2025-01-19	Aurelua Christie	Perempuan	2005-03-09	2005	3	Kuliah	085212159957	Belum Mau Join	Belum CGF	Villa Melati Mas	Villa Melati Mas B9 
44	2025-01-19	Vania	Perempuan	1996-06-28	1996	6	Kerja	081908283390	Belum Mau Join	Belum CGF	BSD	Bsd
45	2025-01-26	Jason Putra Deo	Laki-laki	2005-09-30	2005	9	Kuliah	087867583577	Mau Join	Belum CGF	BSD	Jl. Rawa Buntu Selatan Blok G1 no 17, sektor 1.1, BSD, Tangerang Selatan
46	2025-01-26	Vallerie Ann Harjadi	Perempuan	2006-08-29	2006	8	Kuliah	081298926592	Belum Mau Join	Belum CGF	BSD	Visana The Savia K5/15 BSD
47	2025-01-26	Emily Ann	Perempuan	2002-10-06	2002	10	Kerja	081233569035	Belum Mau Join	Belum CGF	BSD	BSD Visana At The Savia K5/15
48	2025-01-26	Angelique Metta	Perempuan	2001-11-15	2001	11	Kerja	085778873151	Mau Join	Belum CGF	Jakarta	 sunter agung, jakarta utara / piazza the mozia
49	2025-01-26	Conrad Ariando Sahat Tambunan	Laki-laki	2002-07-27	2002	7	Kuliah	085214951127	Mau Join	Belum CGF	BSD	Jalan Palm Kuning IV Blok BE No 2 Griya Loka BSD Sektor 1.3
50	2025-02-16	James Jonathan	Laki-laki	2000-10-06	2000	10	Kerja	082112442594	Belum Mau Join	Belum CGF	Gading Serpong	Gs
51	2025-02-16	Joan Amanda Moningka Wijaya	Perempuan	2006-09-22	2006	9	Kuliah	081547318105	Mau Join	Peace	BSD	Kubikahomy Apartment 
52	2025-02-16	Steven Timothy Octovian Gans	Laki-laki	2004-10-16	2004	10	Kuliah	0816302582	Belum Mau Join	Belum CGF	Gading Serpong	Alamat  Cluster Crystal Jln. Crystal Barat no 45, Gading Serpong, Pakulonan Barat, Kelapa Dua, Tangerang
53	2025-02-16	Grace Aurelia Agustinus	Perempuan	2006-09-25	2006	9	Kuliah	081806027866	Belum Mau Join	Belum CGF	BSD	icon bsd, verdanville H7/31
54	2025-02-16	Tiffani Miracle Yanita	Perempuan	1996-01-08	1996	1	Kerja	087851859919	Mau Join	Belum CGF	BSD	Skyhouse BSD
55	2025-02-16	Celine Angelin	Perempuan	2004-07-03	2004	7	Kuliah	089699733753	Mau Join	Belum CGF	BSD	Navapark BSD
56	2025-02-16	Irene Angelin	Perempuan	2002-01-15	2002	1	Kerja	0895636168111	Belum Mau Join	Belum CGF	BSD	Navapark BSD
57	2025-02-16	Edsel Mahadika Liyis	Laki-laki	1995-04-29	1995	4	Kerja	087875109593	Mau Join	Belum CGF	BSD	Apartemen collins
58	\N	Moris	Laki-laki	\N	\N	\N	Tidak Diisi	\N	Tidak Diisi	Belum CGF	\N	\N
59	2025-02-23	Yasmine Nathania	Perempuan	2025-10-01	2025	10	Kerja	085866799881	Mau Join	Belum CGF	BSD	Puspita Loka Jl Lili Blok G3/5
60	2025-02-23	Calvin Yuslianto	Laki-laki	2000-10-05	2000	10	Kerja	082366347688	Belum Mau Join	Belum CGF	Others	Jl mesjid, sumatra utara, medan barat
61	2025-02-23	Elisabet Meisa	Perempuan	2001-05-16	2001	5	Kerja	081210469462	Mau Join	Belum CGF	Others	-
62	2025-02-23	Eliadi Zalukhu	Laki-laki	2004-01-16	2004	1	Kuliah	082260305286	Mau Join	Belum CGF	Others	Tangerang
63	2025-03-09	Jason Fernando	Laki-laki	2003-03-19	2003	3	Kerja	085350461798	Belum Mau Join	Belum CGF	Others	Kalimantan
64	2025-03-09	Agatha Christie Noviana	Perempuan	2002-09-08	2002	9	Kerja	085387859797	Mau Join	Belum CGF	Others	Kalimantan Barat
65	2025-03-09	Darrell Jeremy	Laki-laki	2005-05-20	2005	5	Kuliah	085894333011	Belum Mau Join	Belum CGF	BSD	Jl. Aru blok RA no. 8, Nusaloka, Bsd, rawa mekar jaya, tanggerang selatan, banten
66	2025-03-09	Robert Muliawan Jaya	Laki-laki	2002-08-09	2002	8	Kerja	087803120999	Mau Join	Belum CGF	Jakarta	Jakarta Barat
67	2025-03-09	Erika	Perempuan	2004-01-21	2004	1	Kuliah	085786988771	Belum Mau Join	Belum CGF	BSD	bsd
68	2025-03-16	Heidi Renata Halim	Perempuan	2002-06-24	2002	6	Kerja	085694733363	Belum Mau Join	Belum CGF	BSD	Allevare A8/2, BSD Cisauk
69	2025-03-16	Janice Andreas	Perempuan	2002-01-01	2002	1	Kerja	081318394147	Mau Join	Belum CGF	Gading Serpong	Gading serpong
70	2025-03-16	Joy Milliaan	Laki-laki	2001-10-31	2001	10	Kerja	081519986610	Belum Mau Join	Belum CGF	Others	Kelapa Gading
71	2025-04-13	Prabandana Raditya	Laki-laki	2000-08-31	2000	8	Kuliah	081380859378	Belum Mau Join	Belum CGF	BSD	The Icon
72	2025-04-27	Andy Tanumihardja	Laki-laki	1992-05-30	1992	5	Kerja	087777086135	Mau Join	Belum CGF	Gading Serpong	Buaran, Serpong
73	2025-04-27	Owen	Laki-laki	2006-09-25	2006	9	Kuliah	\N	Belum Mau Join	Belum CGF	Alam Sutera	Alam Sutera
74	2025-04-27	Nathan Tandra	Laki-laki	2006-02-03	2006	2	Kuliah	\N	Belum Mau Join	Belum CGF	Alam Sutera	Alam sutera
75	2025-04-27	Jongka Hero	Laki-laki	2006-06-04	2006	6	Kuliah	085349512971	Belum Mau Join	Belum CGF	Alam Sutera	Alam Sutera
76	2025-04-27	Piter Lius	Laki-laki	2002-03-19	2002	3	Kerja	085173190341	Belum Mau Join	Belum CGF	Others	Jl. Tpu parakan Gg. Samen mena no.134, benda baru
77	2025-05-18	Fernando Joshua	Laki-laki	1998-02-13	1998	2	Kerja	085171597156	Mau Join	Belum CGF	Others	Jalan salem 1 no. 13
78	2025-05-18	Nichole Christy	Perempuan	1999-07-20	1999	7	Kerja	085780922791	Belum Mau Join	Belum CGF	BSD	NusaLoka jalan Jawa IX 
79	2025-05-18	Frederick Sawedi	Laki-laki	2007-10-14	2007	10	Kuliah	0818319838	Belum Mau Join	Belum CGF	Alam Sutera	Silkwood Residences
80	2025-05-25	Renald Nathaniel Heldi	Laki-laki	2002-05-29	2002	5	Kerja	081299391900	Mau Join	Belum CGF	BSD	The Zora BSD City
81	2025-05-25	Arnold Enrique Utama	Laki-laki	2002-03-05	2002	3	Kerja	085103518518	Belum Mau Join	Belum CGF	Others	Paviljoen 55
82	2025-05-25	Carlos Antonio Lopulalan	Laki-laki	2001-05-06	2001	5	Kerja	081357719421	Mau Join	Belum CGF	Others	Jalan pisangan raya, cirendeu, ciputat timur, tangerang selatan
83	2025-06-08	Felicya	Perempuan	1999-04-02	1999	4	Kerja	08128850355	Belum Mau Join	Belum CGF	Villa Melati Mas	Melati Mas
84	2025-06-08	Kevin Saragih	Laki-laki	2007-01-24	2007	1	Kuliah	081282046275	Mau Join	Belum CGF	BSD	BSD
85	2025-06-08	Indira Hutabarat	Perempuan	2000-08-08	2000	8	Kerja	08159285099	Belum Mau Join	Belum CGF	Others	Jatiwaringin, Bekasi
86	2025-06-08	Lionel Nathan	Laki-laki	2007-11-25	2007	11	Kuliah	081288055789	Belum Mau Join	Belum CGF	BSD	delatinos
87	2025-06-08	Wisely Liu Dennis	Laki-laki	1994-02-11	1994	2	Kerja	087882529388	Belum Mau Join	Belum CGF	Others	kresem 2 no 8g
88	2025-06-08	Harry Ivander	Laki-laki	2002-01-10	2002	1	Kerja	08970441666	Belum Mau Join	Belum CGF	Jakarta	Jakarta selatan
89	2025-06-08	Josua Hakrio	Laki-laki	1997-08-17	1997	8	Kerja	082285101455	Mau Join	Belum CGF	Others	Palm Merah UL 26
90	2025-06-15	Glenn Eric	Laki-laki	2001-02-04	2001	2	Kerja	061434242016	Mau Join	Belum CGF	Others	Sutera delima 60
91	2025-06-22	Sisilia	Perempuan	2001-03-31	2001	3	Kerja	0895340841465	Mau Join	Belum CGF	Others	Komplek Batan Indah Blok P No.23
92	2025-06-29	Natanezra Souw	Laki-laki	1999-11-25	1999	11	Kerja	085157562236	Belum Mau Join	Belum CGF	Others	East Asia 2 No. 5, Green Lake City
93	2025-06-29	Grace Felicia	Perempuan	1999-06-25	1999	6	Kerja	087788773500	Belum Mau Join	Belum CGF	Jakarta	Taman Surya 5 Blok OO4 No 41 Kalideres Jakarta Barat
94	2025-06-29	Evellyn	Perempuan	2005-11-13	2005	11	Kuliah	087899539768	Belum Mau Join	Belum CGF	Alam Sutera	Alam Sutera
95	2025-07-13	Darryn Emilio Nathaniel	Laki-laki	2003-07-15	2003	7	Kerja	082190294730	Belum Mau Join	Belum CGF	Others	Bencongan
96	2025-07-13	Gloria Eirene Setyantoro	Perempuan	2004-10-20	2004	10	Kuliah	088215386932	Belum Mau Join	Belum CGF	Karawaci	Karawaci
97	2025-07-13	Calistha Clementine	Perempuan	2006-02-10	2006	2	Kuliah	087877735240	Belum Mau Join	Belum CGF	Others	Jl Kayu Putih IV no. 95
98	2025-07-13	Joelyna Aurelia Katie Moningka Wijaya	Perempuan	2007-11-22	2007	11	Kuliah	085792107319	Mau Join	Peace	BSD	Kubikahomy
99	2025-07-13	Michael Lika	Laki-laki	2007-09-16	2007	9	Kuliah	085212340916	Mau Join	Faith	BSD	Greencove Blok A5 No. 27
100	2025-07-13	Stephanie Kowinto	Perempuan	2007-08-19	2007	8	Kuliah	08111908072	Mau Join	Faith	Alam Sutera	Alam Sutera
101	2025-07-20	Celine Angelina Tiro	Perempuan	2007-01-23	2007	1	Kuliah	082210902007	Mau Join	Belum CGF	Gading Serpong	strozzi timur 6 no 1
102	2025-07-20	Nathaniel Shawn Edgar Sondakh	Laki-laki	2007-12-07	2007	12	Kuliah	085220007790	Mau Join	Belum CGF	BSD	Delatinos D8/16
103	2025-07-20	Hans Julian Theophilus	Laki-laki	2007-07-16	2007	7	Kuliah	085939572896	Mau Join	Belum CGF	BSD	Anggrek Loka 2.2 AC 10
104	2025-07-20	Clementine Biancalista	Perempuan	2007-05-21	2007	5	Kuliah	08119740121	Mau Join	Belum CGF	Villa Melati Mas	villa melati mas blok L2 no 22A
105	2025-07-20	Vincentius Adryan Hartono	Laki-laki	2007-08-25	2007	8	Kuliah	08121887072	Belum Mau Join	Belum CGF	BSD	Puspitaloka blok A5
106	2025-07-20	Mathew Lambertus Koronpis	Laki-laki	2005-09-08	2005	9	Kerja	0895806291664	Mau Join	Belum CGF	Gading Serpong	Aeston Park
107	2025-07-20	Serviour Lilihata	Laki-laki	2007-06-11	2007	6	Kuliah	082110178535	Mau Join	Belum CGF	Others	Villa Bintaro Regency Blok G3/4, Kec.Pondok Aren, Kota Tangerang Selatan, Banten
108	2025-07-20	Gilbert Salomo Karnoabe Nainggolan	Laki-laki	2007-06-06	2007	6	Kuliah	081292224566	Mau Join	Belum CGF	BSD	Jl. Palm Kuning 1, Blok BC/17, Griya Loka, Sektor 1.3
109	2025-07-20	Alexander Putera Widjaya	Laki-laki	2008-01-18	2008	1	Kuliah	081212664739	Mau Join	Belum CGF	BSD	BSD, Griyaloka, Jalan Cempaka 1, blok H4/4
110	2025-07-20	Jessica Audrey Tjahjadi	Perempuan	2007-01-08	2007	1	Kuliah	085813072773	Belum Mau Join	Belum CGF	BSD	Nusaloka Blok B1/23
111	2025-07-20	Isabelle Anastasia	Perempuan	2007-04-27	2007	4	Kuliah	089506451196	Mau Join	Belum CGF	Villa Melati Mas	Villa Melati Mas blok G-XI/12A
112	2025-07-27	Angelina M	Perempuan	1998-08-27	1998	8	Kerja	082293968781	Belum Mau Join	Belum CGF	Jakarta	jalan permata meruya 1, jakarta barat 
113	2025-07-27	Patricia Audrey	Perempuan	2003-12-20	2003	12	Kerja	081247430521	Belum Mau Join	Belum CGF	Gading Serpong	Atlanta Village
129	2025-09-21	Bryan Hugo Harjono	Laki-laki	2003-03-01	2003	3	Kerja	08119556955	Mau Join	Belum CGF	BSD	Jl. Laurel South 3 no. 5, Navapark
130	2025-09-21	William	Laki-laki	2001-10-26	2001	10	Kerja	061433846208	Mau Join	Belum CGF	BSD	Jl Laurel South 3/5, Nava Park, BSD, Tangerang
131	2025-09-28	Olivia Ajani Rori	Perempuan	2008-05-10	2008	5	Kuliah	081388889670	Mau Join	Belum CGF	Gading Serpong	the green, cluster royal blossom, blok K.6, no.7, Cilenggang, serpong, TangSel 15310 banten
132	2025-10-12	Angeline Firdaus	Perempuan	2005-06-02	2005	6	Kuliah	082332207108	Mau Join	Peace	BSD	B Residence BSD City
133	2025-10-12	Siswanti Rewai	Perempuan	1996-03-01	1996	3	Kerja	085395852762	Mau Join	Miracle	Villa Melati Mas	Melati Mas, Blok D2, nomor 22
134	2025-10-12	Adrian Bayu Persada	Laki-laki	2007-08-25	2007	8	Kuliah	089670174391	Mau Join	Miracle	Villa Melati Mas	Jl Alamanda V, Melati Mas
135	2025-10-19	Kevin Ekarevano	Laki-laki	2007-04-24	2007	4	Kuliah	081211545130	Mau Join	Belum CGF	Gading Serpong	Tangerang Selatan, Serpong
136	2025-10-19	Angelica Puspita	Perempuan	2003-05-15	2003	5	Kerja	081211871117	Belum Mau Join	Belum CGF	Others	Dasana Indah
137	2025-10-19	Shane Gerald Anthony	Laki-laki	2006-12-27	2006	12	Kuliah	081351506650	Mau Join	Belum CGF	Others	Samarinda Kalimantan Timur, perumahan alaya agathis blok ac9
138	2025-10-26	Florence Siregar	Perempuan	2001-03-19	2001	3	Kerja	0682165572861	Mau Join	Cornerstone	Others	kontrakan arema ibu lulu, Jl.Sdi rawa melar jaya no 33
139	2025-11-09	Sendi Setiawan	Laki-laki	2005-04-09	2005	4	Kerja	087749476547	Mau Join	Belum CGF	Others	Perumahan puri bintaro hijau
140	2025-11-09	Nicholas Allarick	Laki-laki	2002-11-25	2002	11	Kerja	08117972002	Belum Mau Join	Belum CGF	Others	Bandar Lampung
141	2025-11-09	Yosua Hia	Laki-laki	1999-09-12	1999	9	Kerja	081262102172	Belum Mau Join	Belum CGF	Others	Jalan Lengkong Gudang Timur
142	2025-11-09	Jonathan Ihutan Leonid Siahaan	Laki-laki	1999-08-16	1999	8	Kerja	081220444548	Mau Join	Belum CGF	Others	Graha raya
9	2024-09-15	Owen Siau	Laki-laki	2005-06-11	2005	6	Kuliah	087839119783	Tidak Diisi	Belum CGF	Alam Sutera	Silkwood Residence
10	2024-09-15	Timothy Lewis	Laki-laki	2003-04-15	2003	4	Kuliah	082148198080	Tidak Diisi	Belum CGF	Others	-
11	2024-09-15	Trissa Lonyka	Perempuan	1998-03-31	1998	3	Kerja	082112507795	Tidak Diisi	Light	BSD	Kencana Loka A4/39, Serpong, Tangsel
12	2024-09-15	Haidee Aditia Iksan	Perempuan	2003-02-24	2003	2	Kuliah	081999352755	Tidak Diisi	Belum CGF	Alam Sutera	Silkwood Residence
13	2024-09-15	Matthew Benney	Laki-laki	2006-12-19	2006	12	Kuliah	081234683643	Tidak Diisi	Belum CGF	Others	sw
14	2024-09-15	Andreas Calvin Tamara	Laki-laki	2000-04-17	2000	4	Kerja	085342170002	Tidak Diisi	Belum CGF	Others	Manado
15	2024-09-15	Alexandro Julio	Laki-laki	2005-07-09	2005	7	Kuliah	08117769968	Tidak Diisi	Belum CGF	Gading Serpong	Malibu Village, Delaplane no 22
16	2024-09-22	Julian Suhendra Tjiang	Laki-laki	2005-07-28	2005	7	Kuliah	087886787285	Tidak Diisi	Belum CGF	BSD	Maxley Suites 
17	2024-09-22	Joseph Laurent	Laki-laki	\N	\N	\N	Kuliah	085216122005	Tidak Diisi	Belum CGF	BSD	Maxley Suites
18	2024-09-22	Vinsensius Christopher Nathaniel Arden	Laki-laki	\N	\N	\N	Kuliah	08158039952	Tidak Diisi	Belum CGF	Gading Serpong	Cb 13 no 7, gading serpong
19	2024-09-29	Dhea Agatha Andrian	Perempuan	\N	\N	\N	Koas di Pluit	08117172145	Tidak Diisi	Belum CGF	Others	Jalan Raya Cisauk Lapan, Kabupaten Tangerang
20	2024-10-02	Yosia Kurnia	Laki-laki	\N	\N	\N	Tidak Diisi	081288991321	Tidak Diisi	Salt	\N	\N
21	2024-10-06	Vilean Amadeo	Laki-laki	\N	\N	\N	Tidak Diisi	0818719377	Tidak Diisi	Belum CGF	\N	\N
22	2024-10-20	Mackanzie Lawrence Anna Wijaya	Laki-laki	2006-05-01	2006	5	Kuliah	081347482517	Belum Mau Join	Belum CGF	Gading Serpong	Horison Grand Serpong
23	2024-10-20	Jordan Sumardi	Laki-laki	1996-01-21	1996	1	Kerja	087883705888	Mau Join	Belum CGF	BSD	puspita loka
24	2024-11-17	Martin Adrian	Laki-laki	\N	\N	\N	Kerja	089503046608	Belum Mau Join	Belum CGF	Others	Cikupa, lavon
143	2025-11-16	Bella Arabella Tandiono	Perempuan	1997-06-29	1997	6	Kerja	087774283529	Mau Join	Belum CGF	Others	Apart Sentraland Cengkarent
144	2025-11-16	Iko Saptian	Laki-laki	1999-02-28	1999	2	Kerja	082110953193	Belum Mau Join	Belum CGF	Others	-
145	2025-11-16	Johan Kurniawan	Laki-laki	1996-09-04	1996	9	Kerja	085710201020	Mau Join	Belum CGF	BSD	bsd foresta
146	2025-11-16	Noverius Telaumbanua	Laki-laki	2000-11-21	2000	11	Kuliah	082363363494	Mau Join	Belum CGF	Others	Lengkong wetan, Tangerang Selatan 
147	2025-11-23	Responida	Perempuan	2001-04-19	2001	4	Kerja	082274690237	Belum Mau Join	Belum CGF	Others	Rawa buntu
148	2025-11-23	Megawati Silalahi	Perempuan	1999-06-08	1999	6	Kerja	082125959714	Mau Join	Belum CGF	Others	Jalan salvia
149	2025-11-23	Audrey Anastasia William	Perempuan	2007-07-07	2007	7	Kuliah	089636951010	Belum Mau Join	Belum CGF	Others	Griya asri, jelupang, blok b9 no 9 
150	2025-11-30	Kharin Angela Kristi	Perempuan	2003-08-08	2003	8	Kerja	0895609999903	Mau Join	Belum CGF	BSD	Regentown B5/15, BSD
1	2024-08-25	Jeprijal Bamen	Laki-laki	2001-04-20	2001	4	Kerja	085337245353	Tidak Diisi	Cornerstone	Others	tangsel . rawa buntu
2	2024-08-25	Diego Tristan	Laki-laki	2005-04-17	2005	4	Kuliah	089529031056	Tidak Diisi	Peace	BSD	Apartemen skyhousw tower leonie
3	2024-08-25	Jovanny Nathania	Perempuan	2006-06-23	2006	6	Kuliah	0811578228	Tidak Diisi	Peace	Alam Sutera	Dorm Binus Alsut
4	2024-09-08	Frederick Winston Christenshend	Laki-laki	2006-03-02	2006	3	Kuliah	082214372492	Tidak Diisi	Belum CGF	Others	pasific garden
5	2024-09-08	Kerlvin Liecarles	Laki-laki	\N	\N	\N	Kerja	082210832397	Tidak Diisi	Belum CGF	Others	-
6	2024-09-08	Silvi Wattimena	Perempuan	2004-09-04	2004	9	Kerja	081273607331	Tidak Diisi	Belum CGF	Gading Serpong	Cilenggang 3 Serpong
7	2024-09-08	Grace Caterina	Perempuan	1998-09-01	1998	9	Kuliah	08568638420	Tidak Diisi	Belum CGF	Gading Serpong	Pondok jagung timur, serpong utara
26	2024-11-24	Michelle	Perempuan	1999-04-23	1999	4	Tidak Diisi	081310924363	Tidak Diisi	Belum CGF	Others	Pluit
114	2025-08-10	Christian Liecarles	Laki-laki	2007-04-26	2007	4	Kuliah	0895326161968	Belum Mau Join	Belum CGF	Others	Jl krisasana no 78 c
115	2025-08-10	Medeline Umboh	Perempuan	2004-04-03	2004	4	Kerja	0895800493047	Mau Join	Belum CGF	Alam Sutera	Silkwood Residence
116	2025-08-10	Theresya Christabsl	Perempuan	2007-09-15	2007	9	Kuliah	0816832688	Belum Mau Join	Belum CGF	BSD	The Zora, Bsd city
117	2025-08-10	Jovanca Marvelia Nathaniel	Perempuan	2007-10-27	2007	10	Kuliah	087885582700	Belum Mau Join	Belum CGF	BSD	Tangerang, BSD, The Icon
118	2025-08-10	Austin Benedict Tambun	Laki-laki	2005-03-19	2005	3	Kuliah	085189444330	Mau Join	Belum CGF	Villa Melati Mas	Regensi Melati Mas Blok H7 no 7
119	2025-08-17	Sener Alden	Laki-laki	2005-09-20	2005	9	Kuliah	081399131522	Mau Join	Belum CGF	BSD	maxley suite
120	2025-08-17	Jason Liko	Laki-laki	2005-05-05	2005	5	Kuliah	081268005773	Mau Join	Belum CGF	Others	Palembang
121	2025-08-24	Claudia Silviany	Perempuan	1997-01-22	1997	1	Kerja	081511457933	Belum Mau Join	Belum CGF	Others	metro sunter blok L nomor 8
122	2025-08-24	Jonathan Reynard	Laki-laki	2001-08-21	2001	8	Kerja	082276931278	Mau Join	Belum CGF	Others	Apartement M town
123	2025-08-24	Marcel Widjaja	Laki-laki	2007-06-05	2007	6	Kuliah	085811556828	Belum Mau Join	Belum CGF	Others	Topaz Timur 1 no 1
124	2025-08-24	Nicholas Gerrard Hermanto	Laki-laki	2007-07-07	2007	7	Kuliah	081385976921	Mau Join	Belum CGF	Gading Serpong	Jl. Flamingo barat no. 52, Cihuni, Pagedangan, Kab. Tangerang, Banten
125	2025-09-13	Morrison Kristianto	Laki-laki	2002-07-17	2002	7	Kerja	089665368544	Mau Join	Sabbath	Gading Serpong	Serpong Regensi Melati Mas Blok E 14 40 Serpong Tangerang Selatan.
126	2025-09-14	Eirene Christy Oktarosa Bayu	Perempuan	1997-10-07	1997	10	Kerja	082210314952	Mau Join	Belum CGF	Others	Tangerang
127	2025-09-14	Yunato	Laki-laki	1993-06-14	1993	6	Kerja	082122379491	Mau Join	Belum CGF	Pamulang	pamulang
128	2025-09-21	Sherika Marvella	Perempuan	2004-03-04	2004	3	Kuliah	08117288890	Mau Join	Belum CGF	BSD	marigold BSD City
151	2025-11-30	Astrid	Perempuan	1991-05-20	1991	5	Kerja	081281989994	Mau Join	Belum CGF	Gading Serpong	Jl. gading Golf Boulevard, Cihuni, Pagedangan, Tangerang, Banten
152	2026-01-18	Jonathan Wijaya	Laki-laki	1997-03-10	1997	3	Kerja	0984621990	Belum Mau Join	Belum CGF	Others	Tenjo
153	2026-01-25	Michelle Luan	Perempuan	2006-01-10	2006	1	Kuliah	08113976008	Belum Mau Join	Belum CGF	Jakarta	jakarta barat
154	2026-01-25	Mario Claudius	Laki-laki	2001-03-22	2001	3	Kuliah	081291206178	Mau Join	Belum CGF	Others	Jl sumatera c.71. no 15/ Tangerang Selatan 
155	2026-01-25	Keisha Zoe Hannah Sumartono	Perempuan	2006-07-08	2006	7	Kuliah	081994344182	Belum Mau Join	Belum CGF	Alam Sutera	Alam Sutera
156	2026-01-25	Leonardo Hasan	Laki-laki	1997-08-16	1997	8	Kerja	07772443402	Mau Join	Belum CGF	Pamulang	Pamulang
157	2026-02-15	Maureen Kimora Wong	Perempuan	2007-08-03	2007	8	Kuliah	08118877859	Mau Join	Belum CGF	Gading Serpong	gading serpong alicante 
158	2026-02-15	Tabita Davinia Utomo	Perempuan	1997-06-04	1997	6	Kerja	085727491727	Mau Join	Belum CGF	BSD	Mozia BSD
159	2026-02-15	Eveline	Perempuan	1995-05-05	1995	5	Kerja	081808798983	Belum Mau Join	Belum CGF	Gading Serpong	Gading Serpong
160	2026-02-15	Livia Kamtono	Perempuan	2001-03-30	2001	3	Kerja	089612746886	Mau Join	Belum CGF	BSD	Nusa loka Jalan Mentawai 1 Blok T7 Nomor 39
161	2026-03-08	Amelia Gandhi	Perempuan	2003-10-24	2003	10	Kerja	085811713362	Belum Mau Join	Belum CGF	Others	jln. duri selatan 1b no.12a 
162	2026-03-08	Jessica Nurgoho	Perempuan	1999-05-30	1999	5	Kerja	081336068328	Mau Join	Belum CGF	BSD	Rukita akemi naturale bsd
163	2026-03-08	Livia	Perempuan	2001-07-30	2001	7	Kerja	081112000602	Mau Join	Belum CGF	BSD	bsd
164	2026-03-08	Jessica Stephanie	Perempuan	1998-10-06	1998	10	Kerja	0895360393491	Mau Join	Belum CGF	BSD	Foresta
165	2026-03-08	Claire	Perempuan	2002-05-03	2002	5	Kerja	085161640305	Belum Mau Join	Belum CGF	Others	Kalimantan Barat
166	2026-03-15	Yunovisri Valenrio Buntuborrong	Laki-laki	2003-05-14	2003	5	Kerja	082344297575	Mau Join	Belum CGF	Gading Serpong	Serpong Garden 1, Cluster Green Valley, Blok E19 No 16.
\.


--
-- Data for Name: cnx_jemaat_clean; Type: TABLE DATA; Schema: public; Owner: eraicode
--

COPY public.cnx_jemaat_clean (no_jemaat, nama_jemaat, jenis_kelamin, tanggal_lahir, tahun_lahir, bulan_lahir, kuliah_kerja, no_handphone, ketertarikan_cgf, nama_cgf, kategori_domisili, alamat_domisili, status_aktif, status_keterangan) FROM stdin;
104	Frida Indari	Perempuan	\N	\N	\N	Kerja	085724114720	Sudah Join	Asin	\N		Inactive	\N
40	Carlos Antonio Lopulalan	Laki-Laki	2001-05-06	2001	5	Kerja	081357719421	Belum Mau Join	Belum CGF	Others	Jalan pisangan raya, cirendeu, ciputat timur, tangerang selatan	Inactive	Budha
44	Celine Angelin	Perempuan	2004-07-03	2004	7	Kuliah	089699733753	Mau Join	Belum CGF	BSD	Navapark BSD	Moved	Kuliah di Korea
60	Clementine Biancalista	Perempuan	2007-05-21	2007	5	Kuliah	08119740121	Mau Join	Belum CGF	Villa Melati Mas	villa melati mas blok L2 no 22A	Moved	Kuliah di LN
38	Calistha Clementine	Perempuan	2006-02-10	2006	2	Kuliah	087877735240	Belum Mau Join	Belum CGF	Others	Jl Kayu Putih IV no. 95	No Information	\N
39	Calvin Yuslianto	Laki-Laki	2000-10-05	2000	10	Kerja	082366347688	Belum Mau Join	Belum CGF	Others	Jl mesjid, sumatra utara, medan barat	Inactive	\N
41	Caroline Avery Tanto	Perempuan	\N	\N	\N	Kuliah	085210037800	Sudah Join	Faith	BSD	BSD	Inactive	\N
42	Catherine	Perempuan	2000-01-08	2000	1	Kerja	\N	Sudah Join	Belum CGF	Gading Serpong	Gading Serpong 7A	Inactive	\N
43	Cecilia Verna Wijaya	Perempuan	1996-09-14	1996	9	Kerja	081296366520	Sudah Join	Miracle	Villa Melati Mas	Villa Melati Mas (VMM)	Active	\N
45	Celine Angelina Tiro	Perempuan	2007-01-23	2007	1	Kuliah	082210902007	Mau Join	Belum CGF	Gading Serpong	Strozzi timur 6, no.1 Gading Serpong	Inactive	\N
46	Charissa Wicaksana	Perempuan	1993-07-16	1993	7	Kerja	081399210495	Sudah Join	Cornerstone	Others	Reni jaya blok c17 no 11 pondok petir bojongsari depok	Active	\N
47	Charlene Ardine Charity	Perempuan	\N	\N	\N	Kerja	081386185810	Mau Join	Belum CGF	BSD	BSD	Inactive	\N
48	Cheryl Aldora	Perempuan	\N	\N	\N	Kerja	081932982818	Sudah Join	Asin	Villa Melati Mas	VMM	Active	\N
49	Christian Liecarles	Laki-Laki	2007-04-26	2007	4	Kuliah	0895326161968	Belum Mau Join	Belum CGF	Others	Jl krisasana no 78 c	Inactive	\N
50	Christie Priscilla Ngantung	Perempuan	\N	\N	\N	Kerja	087877439296	Sudah Join	Salt	BSD	BSD	Inactive	\N
51	Christina Marsela	Perempuan	1995-03-17	1995	3	Kerja	085314528899	Sudah Join	Cornerstone	Others	Kebayoran Baru	Active	\N
52	Christopher Eben Kurniawan	Laki-Laki	1999-08-27	1999	8	Kerja	087809080019	Sudah Join	Cornerstone	BSD	BSD	Active	\N
53	Christopher Pranoto	Laki-Laki	2001-01-03	2001	1	Kerja	08119880659	Sudah Join	Asin	Jakarta	Jakarta	Active	\N
77	Elaine Natalia Parulian Tampubolon	Perempuan	2006-12-25	2006	12	Kuliah	0816944211	Mau Join	Belum CGF	Gading Serpong	Serpong Green Park blok L, no. 3AB	Moved	Kuliah di Semarang
78	Eldwin Manuel	Laki-Laki	\N	\N	\N	Kuliah	0895365240247	Sudah Tidak Join	Belum CGF	\N		Inactive	\N
135	Isabelle Anastasia	Laki-Laki	2007-04-27	2007	4	Kuliah	089506451196	Mau Join	Belum CGF	Villa Melati Mas	Villa Melati Mas blok G-XI/12A	Moved	Kuliah di UI
139	Janet Christy	Perempuan	2000-11-08	2000	11	Kerja	085719115789	Sudah Join	Miracle	Villa Melati Mas	Jl Regensi Melati Mas Blok B3 No 26	Inactive	Ikut KU
141	Janice Andreas	Perempuan	2002-01-01	2002	1	Kerja	081318394147	Mau Join	Belum CGF	Gading Serpong	Gading serpong	Moved	Pergi ke LN
154	Jessica Audrey Tjahjadi	Perempuan	2007-01-08	2007	1	Kuliah	085813072773	Belum Mau Join	Belum CGF	BSD	Nusaloka Blok B1/23	Moved	Kuliah di ITB
186	Kathleen Lauren Wahyudo	Perempuan	2006-09-11	2006	9	Kuliah	088808492655	Mau Join	Belum CGF	Gading Serpong	Serpong Park F1/38 	Moved	Kuliah di Malang
190	Kevin Dallian	Laki-Laki	\N	\N	\N	Kerja	08115752289	Mau Join	Belum CGF	\N		Moved	Pergi ke Pontianak
215	Moris	Laki-Laki	\N	\N	\N	Tidak Diisi	081806167758	Belum Mau Join	Belum CGF	\N		Active	\N
303	Win Tjen	Laki-Laki	\N	\N	\N	Kuliah	081285001187	Sudah Join	Faith	BSD	BSD	Moved	Pulang ke kampung halaman
54	Christy Nathania	Perempuan	1997-08-24	1997	8	Kerja	089602852821	Sudah Join	Miracle	Villa Melati Mas	VMM	Active	\N
55	Cindy Valencia S	Perempuan	2002-01-04	2002	1	Kerja	081249004646	Sudah Tidak Join	Belum CGF	Jakarta	Ampera IV no. 19. Jakarta	No Information	\N
56	Clarisa Manuela	Perempuan	2002-06-15	2002	6	Kerja	08111000569	Sudah Join	Pathaway	BSD	BSD	Active	\N
57	Classico Joydie Sumendap	Laki-Laki	\N	\N	\N	Kuliah	085157078122	Sudah Join	Peace	BSD	BSD	Active	\N
58	Claudia Arantha	Perempuan	1996-05-26	1996	5	Kerja	087774054420	Sudah Join	Cornerstone	BSD	BSD	Active	\N
59	Claudia Silviany	Perempuan	1997-01-22	1997	1	Kerja	081268005773	Belum Mau Join	Belum CGF	Others	metro sunter blok L nomor 8	No Information	\N
61	Conrad Ariando Sahat Tambunan	Laki-Laki	2002-07-27	2002	7	Kerja	085214951127	Mau Join	Belum CGF	BSD	Jalan Palm Kuning IV Blok BE No 2 Griya Loka BSD Sektor 1.3	Inactive	\N
62	Daniel Citra	Laki-Laki	1997-08-30	1997	8	Kerja	085711544980	Sudah Join	Belum CGF	\N		Active	\N
63	Daniel Kho	Laki-Laki	2002-04-11	2002	4	Kerja	081388702830	Sudah Join	Pathaway	\N		Active	\N
64	Daniel Koesno	Laki-Laki	2000-07-02	2000	7	Kerja	085219454579	Sudah Join	Belum CGF	Gading Serpong	Gading Serpong	Active	\N
65	Darrell Jeremy	Laki-Laki	2005-05-20	2005	5	Kuliah	085894333011	Belum Mau Join	Belum CGF	Jakarta	Jakarta Barat	Inactive	\N
66	Darryn Emilio Nathaniel	Laki-Laki	2003-07-15	2003	7	Kerja	082190294730	Belum Mau Join	Belum CGF	Others	Bencongan	No Information	\N
67	David Ssaputra Wijaya	Laki-Laki	2005-04-19	2005	4	Kuliah	\N	Belum Mau Join	Belum CGF	Others	Datrus Garden Reni Jaya Lama Pondok Petir	No Information	\N
68	Debora Emmanuel	Perempuan	2002-04-13	2002	4	Kerja	081585090800	Sudah Join	Pathaway	BSD	BSD	Active	\N
69	Della Puspanegara	Perempuan	\N	\N	\N	Kerja	081294453750	Belum Mau Join	Belum CGF	BSD	Nomaden : Jakarta / BSD / Alam Sutera	Active	\N
70	Dhea Agatha Andrian	Perempuan	2001-10-17	2001	10	Kerja	08117172145	Mau Join	Belum CGF	Others	Jalan Raya Cisauk Lapan, Kabupaten Tangerang	No Information	\N
71	Diego Tristan	Laki-Laki	2005-04-17	2005	4	Kuliah	089529031056	Sudah Join	Peace	BSD	Apartemen skyhousw tower leonie	Inactive	\N
72	Dustin Pradipta	Laki-Laki	1996-09-16	1996	9	Tidak Diisi	087880288500	Mau Join	Belum CGF	BSD	BSD	Active	\N
73	Ebenezer Setiawan	Laki-Laki	1995-10-05	1995	10	Kerja	0817247225	Sudah Join	Asin	BSD	BSD	Inactive	\N
74	Edsel Mahadika Liyis	Laki-Laki	1995-04-29	1995	4	Kerja	087875109593	Mau Join	Belum CGF	BSD	Apartemen collins	No Information	\N
75	Edward Renaldi	Laki-Laki	1999-09-21	1999	9	Kerja	081289686449	Sudah Join	Peace	BSD	BSD	Active	\N
76	Eirene Christy Oktarosa Bayu	Perempuan	1997-10-07	1997	10	Kerja	082210314952	Mau Join	Belum CGF	Others	Tangerang	No Information	\N
79	Eliadi Zalukhu	Laki-Laki	2004-01-16	2004	1	Kuliah	082260305286	Mau Join	Belum CGF	Others	Tangerang	No Information	\N
80	Elisabet Meisa	Perempuan	2001-05-16	2001	5	Kerja	081210469462	Mau Join	Belum CGF	\N		No Information	\N
81	Elizabeth Jenny Trixie	Perempuan	1998-01-01	1998	1	Kerja	085770832323	Sudah Join	Cornerstone	\N		Inactive	\N
82	Elsa Kristina	Perempuan	\N	\N	\N	Kerja	081212072151	Sudah Join	Asin	\N		Inactive	\N
83	Emilius Filibertsus Lisiender	Laki-Laki	2003-09-02	2003	9	Kuliah	081383739491	Sudah Join	Pathaway	Jakarta	Jakarta	Active	\N
84	Emily Ann	Perempuan	2002-10-06	2002	10	Kerja	081233569035	Belum Mau Join	Belum CGF	BSD	BSD Visana At The Savia K5/15	No Information	\N
85	Emmanuel Gultom	Laki-Laki	1999-04-26	1999	4	Kerja	0821042646580	Sudah Join	Miracle	BSD	BSD 	Inactive	\N
86	Epseen	Laki-Laki	2001-05-04	2001	5	Kerja	082136955686	Sudah Join	Sabbath	BSD	BSD 	Active	\N
87	Erika	Perempuan	2004-01-21	2004	1	Kuliah	085786988771	Belum Mau Join	Belum CGF	BSD	BSD 	No Information	\N
307	Wynona	Perempuan	\N	\N	\N	Kuliah	081910470450	Sudah Join	Faith	\N		No Information	\N
88	Ernest Manuel Sowandi	Laki-Laki	2000-04-10	2000	4	Kuliah	085880699608	Sudah Join	Miracle	BSD	BSD 	Inactive	\N
89	Eunice Nahiman Turjono	Perempuan	2000-05-22	2000	5	Kerja	081908081360	Sudah Join	Miracle	BSD	BSD 	Active	\N
90	Evellyn	Perempuan	2005-11-13	2005	11	Kuliah	087899539768	Belum Mau Join	Belum CGF	Alam Sutera	Alam Sutera	No Information	\N
91	F. Giovanni Adi Kusuma	Laki-Laki	\N	\N	\N	Kerja	085290747111	Sudah Join	Asin	Villa Melati Mas	Villa Melati Blok G2 No.13	Active	\N
92	Feby Angelica Soewandono	Perempuan	2002-10-01	2002	10	Kerja	089605336530	Sudah Join	Pathaway	Gading Serpong	Gading Serpong	Active	\N
93	Fei Elita	Perempuan	1997-11-26	1997	11	Kerja	085885338105	Sudah Join	Cornerstone	BSD	Anggrek Loka	Active	\N
94	Felicia Natalie	Perempuan	1997-11-28	1997	11	Kerja	081212488104	Mau Join	Belum CGF	Villa Melati Mas	Villa Melati Mas H7/12A	Inactive	\N
95	Felicia Sarah Wijaya	Perempuan	1997-10-16	1997	10	Kerja	083813659041	Sudah Join	Miracle	Villa Melati Mas	Regensi Melati Mas	Active	\N
96	Felicya	Perempuan	1999-04-02	1999	4	Kerja	08128850355	Belum Mau Join	Belum CGF	Villa Melati Mas	Melati Mas	No Information	\N
97	Felix Nathaniel Surjodinoto	Laki-Laki	2005-01-05	2005	1	Kuliah	08111092251	Mau Join	Belum CGF	Villa Melati Mas	Villa Melati Mas Blok H7/12A	Inactive	\N
98	Ferdinand Wijaya Chandra	Laki-Laki	2001-02-14	2001	2	Kerja	08988396121	Mau Join	Belum CGF	Villa Melati Mas	Villa melati	Active	\N
99	Fernando Joshua	Laki-Laki	1998-02-13	1998	2	Kerja	085171597156	Mau Join	Belum CGF	Others	Jalan salem 1 no. 13	Active	\N
100	Filbert Nathaniel	Laki-Laki	\N	\N	\N	Kerja	085811511007	Belum Mau Join	Belum CGF	Villa Melati Mas	VMM	Inactive	\N
101	Florence Ignatia	Perempuan	\N	\N	\N	Kerja	087889919398	Sudah Join	Asin	BSD	BSD	Inactive	\N
102	Frederick Sawedi	Laki-Laki	2007-10-14	2007	10	Kuliah	0818319838	Belum Mau Join	Belum CGF	Alam Sutera	Silkwood Residences	No Information	\N
103	Frederick Winston Christenshend	Laki-Laki	2006-03-02	2006	3	Kuliah	082214372492	Mau Join	Belum CGF	Others	pasific garden	No Information	\N
105	Gabriel Trifajar Siahaan	Laki-Laki	\N	\N	\N	Kuliah	081219856349	Sudah Join	Light	Others	Bintaro	Active	\N
106	Gabriela Megumi Kristian	Perempuan	\N	\N	\N	Kuliah	085183162804	Mau Join	Belum CGF	Gading Serpong	Ruko Newton Barat no 1, Gading Serping	No Information	\N
107	Gabriella Rose Gunadi	Perempuan	2002-06-02	2002	6	Kerja	089655501721	Sudah Join	Light	BSD	BSD	Active	\N
108	Gabrielle Budiman - Gaby	Perempuan	2002-09-06	2002	9	Kerja	08117496090	Sudah Join	Sabbath	BSD	BSD	Inactive	\N
109	Gabrielle Priskila	Perempuan	1998-07-28	1998	7	Kerja	087881729400	Sudah Join	Cornerstone	BSD	BSD	No Information	\N
110	Geraldy Edson Thamrin	Laki-Laki	1997-04-24	1997	4	Kerja	087710920323	Sudah Join	Miracle	BSD	BSD	Active	\N
111	Gilbert Salomo Karnoabe Nainggolan	Laki-Laki	2007-06-06	2007	6	Kuliah	081292224566	Mau Join	Belum CGF	BSD	Jl. Palm Kuning 1, Blok BC/17, Griya Loka, Sektor 1.3	Inactive	\N
112	Giovanni Hutagaol	Laki-Laki	2002-07-17	2002	7	Kerja	085886095554	Sudah Join	Pathaway	BSD	BSD 	Inactive	\N
113	Glenn Eric	Laki-Laki	2001-02-04	2001	2	Kerja	061434242016	Mau Join	Belum CGF	Others	Sutera delima 60	No Information	\N
114	Gloria Eirene Setyantoro	Perempuan	2004-10-20	2004	10	Kuliah	088215386932	Belum Mau Join	Belum CGF	Karawaci	Karawaci	No Information	\N
115	Glory Amadea Swabawa	Perempuan	1995-07-20	1995	7	Kerja	089661255764	Sudah Join	Miracle	Villa Melati Mas	VMM	Inactive	\N
116	Grace Aurelia Agustinus	Perempuan	2006-09-25	2006	9	Kuliah	081806027866	Belum Mau Join	Belum CGF	BSD	icon bsd, verdanville H7/31	No Information	\N
117	Grace Caterina	Perempuan	1998-09-01	1998	9	Kerja	08568638420	Mau Join	Belum CGF	Gading Serpong	Pondok jagung timur, serpong utara	No Information	\N
118	Grace Felicia	Perempuan	1999-06-25	1999	6	Kerja	087788773500	Belum Mau Join	Belum CGF	Jakarta	Taman Surya 5 Blok OO4 No 41 Kalideres Jakarta Barat	No Information	\N
119	Gracia Hardjasa	Perempuan	2003-06-27	2003	6	Kuliah	085929850627	Sudah Join	Light	\N		Inactive	\N
120	Gustin Finnegan	Laki-Laki	1997-08-04	1997	8	Kerja	089698254298	Sudah Join	Miracle	BSD	BSD	Inactive	\N
121	Haidee Aiditia Iksan	Laki-Laki	2003-02-24	2003	2	Kuliah	081999352755	Mau Join	Belum CGF	Alam Sutera	Silkwood Residence	Active	\N
122	Hans Julian Theophilus	Laki-Laki	2007-07-16	2007	7	Kuliah	085939572896	Mau Join	Belum CGF	BSD	Anggrek Loka 2.2 AC 10	Inactive	\N
123	Hanz Christian	Laki-Laki	2004-02-02	2004	2	Kuliah	085172453770	Mau Join	Belum CGF	BSD	BSD	No Information	\N
124	Harry Ivander	Laki-Laki	2002-01-10	2002	1	Kerja	08970441666	Belum Mau Join	Belum CGF	Jakarta	Jakarta selatan	No Information	\N
125	Heidi Renata Halim	Perempuan	2002-06-24	2002	6	Kerja	085694733363	Belum Mau Join	Belum CGF	BSD	Allevare A8/2, BSD Cisauk	Active	\N
126	Helen Ruth	Perempuan	2002-11-30	2002	11	Kerja	06586219393	Sudah Join	Miracle	BSD	BSD	Inactive	\N
127	Helena Agnes	Perempuan	1997-09-23	1997	9	Kerja	081388125533	Sudah Join	Miracle	Villa Melati Mas	VMM	Active	\N
128	Henokh Ekklesia	Laki-Laki	2000-10-30	2000	10	Kerja	085716806559	Sudah Join	Cornerstone	Karawaci	Karawaci	Inactive	\N
130	Indah Marshanda	Perempuan	\N	\N	\N	Kuliah	\N	Sudah Join	Peace	Gading Serpong	Gading Serpong	Active	\N
131	Indira Hutabarat	Perempuan	2000-08-08	2000	8	Kerja	08159285099	Belum Mau Join	Belum CGF	Others	Jatiwaringin, Bekasi	No Information	\N
132	Irene Angelin	Perempuan	2002-01-15	2002	1	Kerja	0895636168111	Belum Mau Join	Belum CGF	BSD	Navapark BSD	Active	\N
133	Irene Jovita	Perempuan	\N	\N	\N	Kerja	082233595495	Sudah Join	Light	Pamulang	Pamulang	Active	\N
134	Irenerus Ezra	Laki-Laki	1995-05-02	1995	5	Kerja	08985584906	Sudah Join	Salt	BSD	BSD	Inactive	\N
8	Alexandro Julio	Laki-Laki	2005-07-09	2005	7	Kuliah	08117769968	Mau Join	Belum CGF	Gading Serpong	Malibu Village, Delaplane no 22	No Information	\N
136	Jackie Leonardy	Laki-Laki	2000-05-24	2000	5	Kerja	085386343638	Sudah Join	Miracle	Others	Madrid ( Work Abroad )	Inactive	\N
137	Jacob Alianto	Laki-Laki	1994-07-05	1994	7	Kerja	081977117106	Sudah Join	Cornerstone	BSD	BSD 	Active	\N
138	James Jonathan	Laki-Laki	2000-10-06	2000	10	Kerja	082112442594	Belum Mau Join	Belum CGF	Gading Serpong	Gading Serpong	Active	\N
140	Janice Adley	Perempuan	\N	\N	\N	Kerja	085155119742	Sudah Join	Pathaway	Alam Sutera	Alam Sutera	Inactive	\N
142	Jasmine Fidelia Chandra	Perempuan	\N	\N	\N	Kuliah	081319007980	Sudah Join	Faith	BSD	BSD	Active	\N
143	Jason Fernando	Laki-Laki	2003-03-19	2003	3	Kuliah	085350461798	Belum Mau Join	Belum CGF	Others	Kalimantan	No Information	\N
144	Jason Liko	Laki-Laki	2005-05-05	2005	5	Kuliah	081268005773	Mau Join	Belum CGF	Others	Palembang	No Information	\N
145	Jason Putra Deo	Laki-Laki	2005-09-30	2005	9	Kuliah	087867583577	Mau Join	Belum CGF	BSD	Jl. Rawa Buntu Selatan Blok G1 no 17, sektor 1.1, BSD, Tangerang Selatan	Inactive	\N
146	Jason Gavrilleo Santoso	Laki-Laki	\N	\N	\N	Kuliah	087776746569	Mau Join	Belum CGF	Alam Sutera	Alam Sutera	No Information	\N
147	Jason Subandi	Laki-Laki	\N	\N	\N	Kuliah	08111325858	Sudah Join	Peace	BSD	BSD / Bogor	Active	\N
148	Jazzy Gratia Sumendap	Perempuan	2001-03-08	2001	3	Kerja	085156571008	Sudah Join	Belum CGF	Gading Serpong	Gading Serpong	Active	\N
149	Jenifer	Perempuan	2001-11-01	2001	11	Kerja	081251790688	Mau Join	Belum CGF	Gading Serpong	The Avani Deshna	No Information	\N
150	Jennifer Lowell	Perempuan	2001-06-19	2001	6	Kerja	08812123232	Belum Mau Join	Belum CGF	BSD	BSD	Active	\N
151	Jeprijal Bamen	Laki-Laki	1995-04-20	1995	4	Kerja	085337245353	Sudah Join	Cornerstone	BSD	BSD	Inactive	\N
152	Jeremy Claudio Wijaya	Laki-Laki	\N	\N	\N	Kuliah	081298947542	Sudah Tidak Join	Belum CGF	BSD	BSD	Active	\N
153	Jeremy Lewis Surya Tiro	Laki-Laki	1998-08-18	1998	8	Kerja	082267001234	Belum Mau Join	Belum CGF	Gading Serpong	Strozzi timur 6, no.1 Gading Serpong	No Information	\N
155	Jessica Gabriella	Perempuan	\N	\N	\N	Tidak Diisi	\N	Belum Mau Join	Belum CGF	\N		No Information	\N
156	Jessica Octavia	Perempuan	1992-10-12	1992	10	Kerja	085781084400	Sudah Join	Miracle	Villa Melati Mas	Villa Melati Mas (VMM)	Active	\N
157	Jessica Yuliana Wibowo	Perempuan	1996-07-17	1996	7	Kerja	085297778008	Sudah Join	Asin	BSD	BSD	Inactive	\N
158	Jessica Alberti Lowell	Perempuan	2002-06-05	2002	6	Kerja	08812388989	Sudah Join	Peace	BSD	BSD	Active	\N
159	Jessy Clarissa Wijaya	Perempuan	\N	\N	\N	Kuliah	08151810000	Sudah Join	Peace	BSD	BSD	Active	\N
160	Joan	Perempuan	2001-01-04	2001	1	Kerja	081318372764	Sudah Join	Cornerstone	BSD	BSD	Active	\N
161	Joan Amanda Moningka Wijaya	Perempuan	2006-09-22	2006	9	Kuliah	081547318105	Sudah Join	Peace	BSD	Kubikahomy Apartment 	Active	\N
163	Joel Sebastian H	Laki-Laki	2000-08-12	2000	8	Tidak Diisi	08871336092	Sudah Join	Sabbath	\N		Active	\N
164	Joelyna Aurelia Katie Moningka Wijaya	Perempuan	2007-11-22	2007	11	Kuliah	085792107319	Mau Join	Belum CGF	BSD	Kubikahomy	Active	\N
165	Johnny	Perempuan	1993-07-29	1993	7	Kerja	085703355529	Belum Mau Join	Belum CGF	Others	Jalan Guru Mughni, Gang Andil 6	No Information	\N
166	Jonathan Aaron Wijaya	Laki-Laki	2004-09-22	2004	9	Kuliah	085738808893	Sudah Join	Peace	BSD	BSD	Active	\N
167	Jonathan Koesno	Laki-Laki	\N	\N	\N	Kerja	081219158259	Sudah Join	Belum CGF	\N		Inactive	\N
168	Jonathan Reynard	Laki-Laki	\N	\N	\N	Kerja	082276931278	Mau Join	Belum CGF	Others	Apartement M town	No Information	\N
169	Jonathan Widi Cahyadi	Laki-Laki	1993-12-04	1993	12	Kerja	081212140388	Sudah Join	Miracle	Pamulang	Pamulang	Inactive	\N
170	Jongka Hero	Laki-Laki	2006-06-04	2006	6	Kuliah	085349512971	Belum Mau Join	Belum CGF	Alam Sutera	Alam Sutera	No Information	\N
171	Jordan Sumardi	Laki-Laki	1996-01-21	1996	1	Kerja	087883705888	Mau Join	Belum CGF	BSD	puspita loka	Inactive	\N
172	Joseph Laurent	Perempuan	2005-12-16	2005	12	Kuliah	085216122005	Mau Join	Belum CGF	BSD	Maxley Suites	Active	\N
173	Josephine Kalista Utomo	Laki-Laki	1999-11-21	1999	11	Kerja	087879112002	Belum Mau Join	Belum CGF	Others	Lippo Cikarang	Inactive	\N
174	Josh Marvel Nathan	Laki-Laki	2002-05-15	2002	5	Kerja	087873014204	Sudah Join	Cornerstone	BSD	The Icon BSD	Active	\N
175	Joshua Renaldo	Laki-Laki	1997-07-11	1997	7	Kerja	085280315906	Sudah Join	Miracle	Villa Melati Mas	Villa Melati Mas (VMM)	Active	\N
176	Josia Joseph Chandra	Laki-Laki	\N	\N	\N	Tidak Diisi	\N	Sudah Join	Sabbath	\N		Active	\N
177	Josua Hakrio	Laki-Laki	1997-08-17	1997	8	Kerja	082285101455	Mau Join	Belum CGF	Others	Palm Merah UL 26	No Information	\N
178	Jovanca Marvelia Nathaniel	Perempuan	2007-10-27	2007	10	Kuliah	087885582700	Belum Mau Join	Belum CGF	BSD	Tangerang, BSD, The Icon	Active	\N
179	Jovanny Nathania	Perempuan	2006-06-23	2006	6	Kuliah	0811578228	Mau Join	Belum CGF	Alam Sutera	Dorm Binus Alsut	No Information	\N
180	Jovito Colin	Laki-Laki	\N	\N	\N	Tidak Diisi	\N	Belum Mau Join	Belum CGF	\N		No Information	\N
181	Joy Milliaan	Laki-Laki	2001-10-31	2001	10	Kerja	081519986610	Belum Mau Join	Belum CGF	Others	Kelapa Gading	No Information	\N
182	Julia	Perempuan	1998-07-08	1998	7	Kerja	085219891478	Mau Join	Belum CGF	Others	Batalyon Kav 9	No Information	\N
183	Julian Suhendra Tjiang	Laki-Laki	2005-07-28	2005	7	Kuliah	087886787285	Belum Mau Join	Belum CGF	BSD	Maxley Suites	No Information	\N
184	Julian Tirtadjaja	Laki-Laki	1995-12-12	1995	12	Kerja	082123229622	Sudah Join	Belum CGF	Villa Melati Mas	Villa Melati Mas (VMM)	Inactive	\N
185	Karen Florencia	Perempuan	\N	\N	\N	Kerja	087760462190	Belum Mau Join	Belum CGF	Gading Serpong	Gading Serpong 7A	Inactive	\N
187	Kenneth Chuhairy	Laki-Laki	1996-08-17	1996	8	Kerja	0817862555	Sudah Join	Miracle	BSD	Giri Loka, BSD	Inactive	\N
188	Kerfin	Laki-Laki	1995-05-21	1995	5	Kerja	089530442023	Sudah Join	Miracle	Villa Melati Mas	VMM	Active	\N
189	Kerlvin Liecarles	Laki-Laki	2002-10-08	2002	10	Kerja	082210832397	Sudah Join	Pathaway	BSD	BSD	Active	\N
191	Kevin Saragih	Laki-Laki	2007-01-24	2007	1	Kuliah	081282046275	Mau Join	Belum CGF	BSD	BSD	No Information	\N
192	Kezia Angeline	Perempuan	2001-09-03	2001	9	Kuliah	082210902001	Sudah Join	Light	Gading Serpong	Strozzi timur 6, no.1 Gading Serpong	Active	\N
194	Kimberly	Perempuan	2000-09-09	2000	9	Kerja	014243957481	Sudah Join	Miracle	\N		Active	\N
195	Lionel Nathan	Laki-Laki	2007-11-25	2007	11	Kuliah	081288055789	Belum Mau Join	Belum CGF	BSD	delatinos	No Information	\N
196	Lisa Virianti Mulyo	Perempuan	\N	\N	\N	Tidak Diisi	081933133975	Mau Join	Belum CGF	\N		No Information	\N
4	Agatha Christie Noviana	Perempuan	2002-09-08	2002	9	Kerja	085387859797	Mau Join	Belum CGF	Others	Kalimantan Barat	No Information	\N
193	Kezia Putri Deo	Perempuan	\N	\N	\N	Kuliah	087796164664	Sudah Join	Faith	BSD	BSD	Active	\N
197	Luckemeraldo Jardel	Laki-Laki	2006-10-11	2006	10	Kuliah	081217378890	Sudah Join	Faith	BSD	BSD	Active	\N
198	Luis Manuel	Laki-Laki	2002-08-15	2002	8	Kerja	08111000559	Mau Join	Belum CGF	\N		Inactive	\N
199	Mackanzie Lawrence Anna Wijaya	Perempuan	\N	\N	\N	Kuliah	081347482517	Mau Join	Belum CGF	Gading Serpong	Serpong	No Information	\N
200	Mandy Theodora	Perempuan	\N	\N	\N	Kuliah	081318511111	Sudah Join	Belum CGF	Others	Lippo Village	Inactive	\N
201	Marcel Widjaja	Laki-Laki	2007-06-05	2007	6	Kuliah	085811556828	Belum Mau Join	Belum CGF	Others	Topaz Timur 1 no 1	No Information	\N
202	Marcelino	Laki-Laki	2006-08-11	2006	8	Kuliah	081388509442	Sudah Join	Peace	BSD	BSD	Inactive	\N
203	Mathew Lambertus Koronpis	Laki-Laki	2005-09-08	2005	9	Kuliah	0895806291664	Mau Join	Belum CGF	Gading Serpong	Aeston Park	Inactive	\N
204	Matthew Benney	Laki-Laki	2006-12-19	2006	12	Kuliah	081234683643	Mau Join	Belum CGF	Others	sw	No Information	\N
205	Maura Sukamto	Perempuan	\N	\N	\N	Kuliah	017088826915	Sudah Join	Cornerstone	BSD	Giri Loka, lg kuliah di us	Inactive	\N
206	Medeline Umboh	Perempuan	2004-04-03	2004	4	Kerja	0895800493047	Mau Join	Belum CGF	Alam Sutera	Silkwood Residence	No Information	\N
207	Megan Evangeline	Perempuan	2004-08-20	2004	8	Kuliah	08195588559	Sudah Join	Peace	Gading Serpong	Gading Serpong	Active	\N
208	Melliani Yulianty Dipanggil Mel/Mei/Melli	Perempuan	\N	\N	\N	Kerja	081298802653	Mau Join	Belum CGF	Pamulang	Pamulang	Active	\N
209	Merfin	Laki-Laki	1995-05-21	1995	5	Kerja	089632001951	Sudah Join	Miracle	Villa Melati Mas	VMM	Active	\N
210	Michael Lika	Laki-Laki	2007-09-16	2007	9	Kuliah	085212340916	Mau Join	Belum CGF	BSD	Greencove Blok A5 No. 27	No Information	\N
211	Michelle	Perempuan	1999-04-23	1999	4	Kerja	081310924363	Mau Join	Belum CGF	Others	Pluit	No Information	\N
212	Michelle Caroline Obaja	Perempuan	2006-10-04	2006	10	Kuliah	081213654097	Mau Join	Belum CGF	Gading Serpong	Jalan Taman Beryl No. 9, Cluster Beryl, Gading Serpong	No Information	\N
213	Michelle Gwylyn Wijaya	Perempuan	2001-04-08	2001	4	Kerja	081212870970	Mau Join	Belum CGF	Villa Melati Mas	VMM	No Information	\N
214	Mona Sinaga	Laki-Laki	1988-12-19	1988	12	Kerja	085312849171	Mau Join	Belum CGF	Others	jalan ciater raya blok c nomor 11	Moved	\N
216	Morrison Kristianto	Laki-Laki	2002-07-17	2002	7	Kerja	089665368544	Mau Join	Belum CGF	Gading Serpong	Serpong Regensi Melati Mas Blok E 14 40 Serpong Tangerang Selatan.	Active	\N
217	Nadine Eschetetodia	Perempuan	\N	\N	\N	Kerja	\N	Belum Mau Join	Belum CGF	Villa Melati Mas	Regensi Melati Mas	Inactive	\N
218	Naditta Hutagaol	Perempuan	2006-12-01	2006	12	Kuliah	085591744749	Sudah Join	Faith	BSD	BSD	Active	\N
219	Naftali Brigitta Gunawan	Perempuan	2003-03-15	2003	3	Kuliah	081282631726	Sudah Join	Light	Others	Ciater	Inactive	\N
220	Naomi Krisanty	Perempuan	\N	\N	\N	Kerja	085885105106	Sudah Join	Peace	BSD	BSD	No Information	\N
221	Natanezra Souw	Laki-Laki	1999-11-25	1999	11	Kerja	085157562236	Belum Mau Join	Belum CGF	Others	East Asia 2 No. 5, Green Lake City	No Information	\N
222	Nathan Tandra	Laki-Laki	2006-02-03	2006	2	Kuliah	\N	Belum Mau Join	Belum CGF	Alam Sutera	Alam sutera	Active	\N
223	Nathania Alethea Rianto Sigit	Perempuan	1998-01-08	1998	1	Kerja	08194849449	Sudah Join	Belum CGF	Gading Serpong	GS	Active	\N
224	Nathania Sofie	Perempuan	1997-10-10	1997	10	Kerja	08997894334	Sudah Join	Belum CGF	Gading Serpong	Gading Serpong	No Information	\N
225	Nathaniel Shawn Edgar Sondakh	Laki-Laki	2007-12-07	2007	12	Kuliah	085220007790	Mau Join	Belum CGF	BSD	Delatinos D8/16	Inactive	\N
226	Nevio Nathanael	Laki-Laki	\N	\N	\N	Kerja	081290224011	Belum Mau Join	Belum CGF	Others	Pavilion Residence A5/7	No Information	\N
227	Nicholas Gerrard Hermanto	Laki-Laki	2007-07-07	2007	7	Kuliah	081385976921	Mau Join	Belum CGF	Gading Serpong	Jl. Flamingo barat no. 52, Cihuni, Pagedangan, Kab. Tangerang, Banten	Active	\N
228	Nichole Christy	Perempuan	1999-07-20	1999	7	Kerja	085780922791	Belum Mau Join	Belum CGF	BSD	NusaLoka jalan Jawa IX 	Inactive	\N
229	Nicola Melodyta Suryodinoto	Perempuan	2002-01-14	2002	1	Kuliah	089502506000	Mau Join	Belum CGF	BSD	BSD Sektor 1-2, Jl. Magnolia 4 blok F no.7	Inactive	\N
230	Nicoline Dorothy Santoso	Perempuan	2005-12-08	2005	12	Tidak Diisi	08119990812	Mau Join	Belum CGF	BSD	BSD	Inactive	\N
232	Olivia Ajani Rori	Perempuan	2008-05-10	2008	5	Kuliah	081388889670	Mau Join	Belum CGF	Gading Serpong	the green, cluster royal blossom, blok K.6, no.7, Cilenggang, serpong, TangSel 15310 banten	Active	\N
233	Osbert Nathaniel Wibowo	Laki-Laki	2001-11-09	2001	11	Kuliah	085881698702	Sudah Join	Pathaway	Villa Melati Mas	VMM	Inactive	\N
234	Oswin Suwandi	Laki-Laki	1999-12-11	1999	12	Kuliah	087771777154	Sudah Join	Miracle	Villa Melati Mas	VMM	No Information	\N
235	Owen	Laki-Laki	2006-09-25	2006	9	Kuliah	087839119783	Mau Join	Belum CGF	Alam Sutera	Alam Sutera	No Information	\N
236	Owen Siau	Laki-Laki	2005-06-11	2005	6	Kuliah	087839119783	Mau Join	Belum CGF	Alam Sutera	Silkwood Residence	Inactive	\N
237	Pascal Nathaniel	Laki-Laki	\N	\N	\N	Kerja	\N	Belum Mau Join	Belum CGF	\N		No Information	\N
238	Patricia Audrey	Laki-Laki	2003-12-20	2003	12	Kerja	081247430521	Belum Mau Join	Belum CGF	Gading Serpong	Atlanta Village	Inactive	\N
239	Patrick Christoper	Laki-Laki	\N	\N	\N	Kuliah	081293221250	Sudah Tidak Join	Belum CGF	BSD	BSD	Inactive	\N
240	Paulus Adi Wau	Laki-Laki	2003-08-25	2003	8	Kuliah	0895635020257	Sudah Join	Light	BSD	BSD	Inactive	\N
241	Phoebe Nathania	Perempuan	2000-11-02	2000	11	Kerja	08111530211	Sudah Join	Belum CGF	Gading Serpong	Gading Serpong	No Information	\N
242	Piter Lius	Laki-Laki	2002-03-19	2002	3	Kerja	085173190341	Belum Mau Join	Belum CGF	Others	Jl. Tpu parakan Gg. Samen mena no.134, benda baru	No Information	\N
243	Prabandana Raditya	Laki-Laki	2000-08-31	2000	8	Kerja	081380859378	Belum Mau Join	Belum CGF	BSD	The Icon	Active	\N
244	Primuadi Bali	Laki-Laki	1999-01-09	1999	1	Kerja	082311634560	Sudah Join	Sabbath	BSD	BSD	Active	\N
245	Putri Kasiman	Laki-Laki	2005-10-25	2005	10	Kuliah	087867583546	Sudah Join	Faith	BSD	BSD	No Information	\N
246	Ralph	Laki-Laki	\N	\N	\N	Tidak Diisi	\N	Sudah Tidak Join	Belum CGF	\N		Active	\N
247	Rayner Gabrielle	Laki-Laki	2001-05-08	2001	5	Kerja	085920339955	Sudah Join	Belum CGF	Gading Serpong	Gading Serpong	Inactive	\N
248	Renald Nathaniel Heldi	Laki-Laki	2002-05-29	2002	5	Kerja	0818319838	Belum Mau Join	Belum CGF	BSD	The Zora BSD City	Active	\N
253	Ryan Nathanael Wongso - Ryan	Laki-Laki	\N	\N	\N	Kerja	087843130828	Sudah Join	Salt	Jakarta	Jakarta	Active	\N
254	Saint Diven	Perempuan	\N	\N	\N	Kerja	085883035551	Mau Join	Belum CGF	Pamulang	Pamulang	Inactive	\N
255	Sam	Laki-Laki	2003-08-07	2003	8	Kuliah	081316007035	Sudah Join	Pathaway	BSD	BSD	Inactive	\N
256	Sarah Lynn	Perempuan	2003-06-16	2003	6	Kuliah	081388187873	Sudah Join	Belum CGF	Others	TangKot Modernland	Active	\N
258	Sean Gabriel	Laki-Laki	\N	\N	\N	Tidak Diisi	\N	Sudah Tidak Join	Belum CGF	\N		No Information	\N
259	Sener Alden	Laki-Laki	2005-09-20	2005	9	Kuliah	081399131522	Mau Join	Belum CGF	BSD	maxley suite	No Information	\N
264	Sisilia	Perempuan	2001-03-31	2001	3	Kerja	0895340841465	Mau Join	Belum CGF	Others	Komplek Batan Indah Blok P No.23	Inactive	\N
5	Agnes Feby	Perempuan	\N	\N	\N	Kerja	085217186165	Sudah Join	Salt	\N		Inactive	\N
6	Alexander Putera Widjaya	Laki-Laki	2008-01-18	2008	1	Kuliah	081212664739	Mau Join	Belum CGF	BSD	BSD, Griyaloka, Jalan Cempaka 1, blok H4/4	No Information	\N
7	Alexandra Madeline Rachel Boham	Perempuan	2005-05-17	2005	5	Kuliah	081212376714	Sudah Join	Faith	BSD	BSD	Active	\N
9	Alicia Natasha Dynanty	Perempuan	2000-12-29	2000	12	Kerja	081293576622	Sudah Join	Cornerstone	BSD	BSD	Active	\N
10	Allicia Kustanto	Perempuan	\N	\N	\N	Kerja	085210221998	Belum Mau Join	Belum CGF	BSD	BSD	Inactive	\N
11	Alphasius Omega Dixon	Laki-Laki	1996-05-07	1996	5	Kerja	081806167758	Sudah Join	Cornerstone	Pamulang	Pamulang 	Active	\N
257	Sean Arden	Laki-Laki	\N	\N	\N	Kerja	08161399363	Sudah Join	Cornerstone	Others	Sunter	Inactive	\N
266	Stephanie Joana	Perempuan	\N	\N	\N	Kerja	081908035450	Sudah Join	Salt	\N		Inactive	\N
267	Stephanie Kowinto	Perempuan	2007-08-19	2007	8	Kuliah	08111908072	Mau Join	Belum CGF	Alam Sutera	Alam Sutera	Active	\N
268	Stephen Renaldi	Laki-Laki	\N	\N	\N	Kerja	081290236252	Belum Mau Join	Belum CGF	BSD	BSD	No Information	\N
269	Steven Timothy Octovian Gans	Laki-Laki	2004-10-16	2004	10	Kuliah	0816302582	Belum Mau Join	Belum CGF	Gading Serpong	Cluster Crystal Jln. Crystal Barat no 45, Gading Serpong, Pakulonan Barat, Kelapa Dua, Tangerang	Active	\N
270	Thelissa Levana Zheng	Perempuan	2004-04-15	2004	4	Kuliah	081806411504	Sudah Join	Pathaway	BSD	BSD	No Information	\N
271	Theresya Christabsl	Perempuan	2007-09-15	2007	9	Kuliah	0816832688	Belum Mau Join	Belum CGF	BSD	The Zora, Bsd city	No Information	\N
272	Tiffani Miracle Yanita	Perempuan	1996-01-08	1996	1	Kerja	087851859919	Mau Join	Belum CGF	BSD	Skyhouse BSD	Inactive	\N
273	Timothy Frederick Lukas	Perempuan	1998-02-07	1998	2	Kerja	0817136270	Sudah Join	Miracle	Villa Melati Mas	VMM	No Information	\N
274	Timothy Lewis	Laki-Laki	2004-04-15	2004	4	Kuliah	082148198080	Belum Mau Join	Belum CGF	\N		Inactive	\N
282	Vanesa	Perempuan	1999-03-16	1999	3	Kerja	08990168893	Sudah Join	Miracle	Villa Melati Mas	Regency melati mas blok C6/6	Inactive	\N
283	Vanessa Danniella	Perempuan	\N	\N	\N	Kerja	089692649731	Sudah Tidak Join	Belum CGF	\N		Active	\N
284	Vanessa Evelyn Thamrin	Perempuan	2004-06-17	2004	6	Kerja	081808662121	Sudah Join	Pathaway	BSD	BSD	No Information	\N
285	Vania	Perempuan	1996-06-28	1996	6	Kerja	081908283390	Belum Mau Join	Belum CGF	BSD	BSD	Active	\N
286	Velica Theophila	Perempuan	\N	\N	\N	Kerja	089522333180	Belum Mau Join	Belum CGF	Others	Jl Kubis 1 Blok A1 No. 12	No Information	\N
287	Veronicca	Perempuan	1999-10-03	1999	10	Kerja	082282782770	Mau Join	Belum CGF	BSD	Gading Icon Apartment, Jakarta	Inactive	\N
288	Vetta Widarto	Perempuan	\N	\N	\N	Kerja	081325902501	Sudah Join	Salt	\N		Active	\N
289	Vidrey	Perempuan	2000-10-22	2000	10	Kerja	082124202722	Sudah Join	Cornerstone	BSD	BSD	Inactive	\N
290	Vieka Santoso	Perempuan	2002-01-06	2002	1	Kerja	0811140948	Belum Mau Join	Belum CGF	BSD	BSD	Active	\N
291	Vieta Santoso	Perempuan	1996-04-05	1996	4	Kerja	081297766377	Sudah Join	Miracle	BSD	Taman Tirta Golf	No Information	\N
292	Vincent Leonardo	Laki-Laki	2005-07-30	2005	7	Kuliah	081381818084	Sudah Join	Miracle	Villa Melati Mas	VMM	Active	\N
293	Vincent Nathaniel	Laki-Laki	\N	\N	\N	Kerja	08111772775	Sudah Join	Belum CGF	Alam Sutera	Alam Sutera	Active	\N
294	Vincentius Adryan Hartono	Laki-Laki	2007-08-25	2007	8	Kuliah	08121887072	Belum Mau Join	Belum CGF	BSD	Puspitaloka blok A5	Inactive	\N
295	Vinsensius Christopher Nathaniel Arden	Laki-Laki	2002-05-09	2002	5	Kerja	08158039952	Sudah Join	Belum CGF	Gading Serpong	Gading Serpong	Inactive	\N
296	Vioren Defika	Perempuan	2002-05-16	2002	5	Kerja	081289939877	Belum Mau Join	Belum CGF	Gading Serpong	Gading Serpong	Inactive	\N
297	Virgilius Tan	Laki-Laki	\N	\N	\N	Kerja	085310220766	Sudah Tidak Join	Belum CGF	Others	Tangerang	No Information	\N
298	Vivian Sumendap	Perempuan	\N	\N	\N	Kuliah	085325536877	Belum Mau Join	Belum CGF	BSD	BSD (Kuliah Prasmul)	Active	\N
299	Wahyu Wijaya	Laki-Laki	2003-03-27	2003	3	Kuliah	0817271369	Sudah Join	Faith	Alam Sutera	Alam Sutera	Active	\N
300	Wiku Melisa	Perempuan	\N	\N	\N	Kerja	08117044359	Sudah Join	Salt	Jakarta	Jakarta	No Information	\N
301	William	Laki-Laki	2001-10-26	2001	10	Kerja	061433846208	Mau Join	Belum CGF	BSD	Jl Laurel South 3/5, Nava Park, BSD, Tangerang	Active	\N
302	William Handel Lowry	Laki-Laki	1995-10-07	1995	10	Kerja	082253091274	Sudah Join	Cornerstone	BSD	BSD	Inactive	\N
304	Winston	Laki-Laki	2006-03-02	2006	3	Kuliah	082214372492	Belum Mau Join	Belum CGF	Alam Sutera	Alam Sutera	Active	\N
305	Wisely Liu Dennis	Laki-Laki	1994-02-11	1994	2	Kerja	087882529388	Belum Mau Join	Belum CGF	Others	kresem 2 no 8g	Active	\N
306	Wynner Rafaelle	Laki-Laki	2003-08-23	2003	8	Kuliah	087881200862	Sudah Join	Pathaway	Gading Serpong	Gading Serpong	Inactive	\N
308	Yasmine Nathania	Perempuan	\N	\N	\N	Kerja	085866799881	Mau Join	Belum CGF	BSD	Puspita Loka Jl Lili Blok G3/5	Active	\N
1	Abraham Christopher Elgrego	Laki-Laki	2002-03-15	2002	3	Kerja	081338245611	Sudah Join	Pathaway	Gading Serpong	Gading Serpong	Active	\N
2	Accoladea Wijaya	Perempuan	2003-06-01	2003	6	Kuliah	0895353279881	Sudah Join	Light	Villa Melati Mas	VMM	Active	\N
3	Agata Fortuna	Perempuan	1998-04-21	1998	4	Kerja	08115788772	Mau Join	Miracle	Gading Serpong	Tabebuya inspirahaus f5 no 10	Active	\N
129	Hubert Tatra	Laki-Laki	1999-03-07	1999	3	Kerja	08117572378	Sudah Join	Cornerstone	BSD	BSD	Active	\N
231	Olivia	Perempuan	\N	\N	\N	Tidak Diisi	088291996778	Sudah Join	Belum CGF	\N		No Information	\N
249	Riandy W	Laki-Laki	\N	\N	\N	Kerja	\N	Sudah Join	Cornerstone	BSD	Foresta Raya Cluster Studento	Active	\N
250	Robert Muliawan Jaya	Laki-Laki	2002-08-09	2002	8	Kerja	087803120999	Mau Join	Belum CGF	Jakarta	Jakarta Barat	Active	\N
251	Ruth Yura Gracia Gultom	Perempuan	1995-04-14	1995	4	Kerja	081289480600	Sudah Join	Miracle	BSD	BSD	Active	\N
252	Ryan Agustian	Laki-Laki	2001-08-30	2001	8	Kerja	0895803248903	Belum Mau Join	Belum CGF	BSD	BSD	Active	\N
260	Septawon	Laki-Laki	1999-09-06	1999	9	Kerja	0812544230549	Mau Join	Belum CGF	Gading Serpong	Serpong	Active	\N
261	Serviour Lilihata	Laki-Laki	2007-06-11	2007	6	Kuliah	082110178535	Mau Join	Belum CGF	Others	Villa Bintaro Regency Blok G3/4, Kec.Pondok Aren, Kota Tangerang Selatan, Banten	Active	\N
262	Sherika Marvella	Perempuan	2004-03-04	2004	3	Kuliah	08117288890	Mau Join	Belum CGF	BSD	marigold BSD City	No Information	\N
263	Silvi Wattimena	Perempuan	2004-09-04	2004	9	Kerja	081273607331	Belum Mau Join	Belum CGF	Gading Serpong	Serpong	Active	\N
265	Stanly	Laki-Laki	\N	\N	\N	Kerja	08113923278	Sudah Join	Belum CGF	Gading Serpong	Gading Serpong 7A	Inactive	\N
309	Yoel Cavello	Laki-Laki	2000-06-05	2000	6	Kerja	089679657452	Sudah Join	Cornerstone	BSD	BSD	Inactive	\N
310	Yohannes Gunawan	Laki-Laki	\N	\N	\N	Kerja	087882178560	Sudah Join	Salt	Others	Jalan raya bukit serua	Active	\N
311	Yosafat Hans Wijaya	Laki-Laki	1998-03-21	1998	3	Kerja	0895336787578	Sudah Join	Miracle	Alam Sutera	Alam Sutera	Inactive	\N
312	Yosia Kurnia	Laki-Laki	\N	\N	\N	Kerja	081288991321	Sudah Join	Salt	BSD	Daerah BSD	No Information	\N
12	Alvina Rotua Maharani Tambunan	Perempuan	1999-01-27	1999	1	Kerja	081211630473	Sudah Join	Cornerstone	BSD	BSD	Active	\N
13	Ancillia Wijaya	Perempuan	1999-06-17	1999	6	Kerja	082213620637	Belum Mau Join	Belum CGF	Villa Melati Mas	Villa Melati Mas Blok I 11 No. 56	No Information	\N
14	Andreas Calvin Tamara	Laki-Laki	2000-04-17	2000	4	Kerja	085342170002	Mau Join	Belum CGF	Others	Manado	Inactive	\N
15	Andrew Halim	Laki-Laki	1988-09-18	1988	9	Kerja	082167460828	Sudah Tidak Join	Belum CGF	Jakarta	Jakarta Barat	Inactive	\N
16	Andy Tanumihardja	Laki-Laki	1992-05-30	1992	5	Kerja	087777086135	Mau Join	Belum CGF	Gading Serpong	Buaran, Serpong	No Information	\N
17	Angelina M	Perempuan	1998-08-27	1998	8	Kerja	082293968781	Belum Mau Join	Belum CGF	BSD	BSD	No Information	\N
18	Angeline Calista Slamet	Perempuan	2002-01-18	2002	1	Kerja	089522333181	Belum Mau Join	Belum CGF	BSD	BSD	Active	\N
19	Angelique Metta	Perempuan	2001-11-15	2001	11	Kerja	085778873151	Mau Join	Belum CGF	Jakarta	 sunter agung, jakarta utara / piazza the mozia	No Information	\N
20	Angga Avila	Laki-Laki	1991-04-13	1991	4	Kerja	085163716898	Sudah Join	Belum CGF	Karawaci	Karawaci	Inactive	\N
21	Antony Dinata	Laki-Laki	1994-04-22	1994	4	Kerja	082210198810	Sudah Join	Miracle	\N		Active	\N
22	Ardi Wiriadinata	Laki-Laki	\N	\N	\N	Kerja	081355132068	Sudah Join	Light	BSD	BSD	Active	\N
23	Ardya Kristina	Laki-Laki	\N	\N	\N	Kerja	087871951980	Sudah Join	Miracle	Gading Serpong	Serpong Park	Active	\N
24	Ariel Vito Suyata Ong	Laki-Laki	2002-05-11	2002	5	Kerja	082283712292	Sudah Join	Cornerstone	BSD	BSD	Active	\N
25	Armand Pantouw	Laki-Laki	\N	\N	\N	Kerja	0811969632	Sudah Join	Light	BSD	Taman giri loka	Active	\N
26	Arnold Enrique Utama	Laki-Laki	2002-03-05	2002	3	Kerja	085103518518	Belum Mau Join	Belum CGF	Others	Paviljoen 55	No Information	\N
27	Aurelua Christie	Perempuan	2005-03-09	2005	3	Kuliah	085212159957	Belum Mau Join	Belum CGF	Villa Melati Mas	Villa Melati Mas B9 	No Information	\N
28	Austin Benedict Tambun	Laki-Laki	2005-03-19	2005	3	Kuliah	087885582700	Mau Join	Belum CGF	Villa Melati Mas	Regensi Melati Mas Blok H7 no 7	No Information	\N
29	Axel Kanata	Laki-Laki	\N	\N	\N	Kuliah	0895602299239	Sudah Join	Sabbath	\N		Active	\N
30	Ayu Aprilia	Perempuan	\N	\N	\N	Kuliah	08111388069	Sudah Join	Miracle	Villa Melati Mas	VMM	Inactive	\N
31	Bella Kumalasari	Perempuan	1993-09-22	1993	9	Kerja	081283728738	Sudah Join	Miracle	Villa Melati Mas	VMM	Inactive	\N
32	Bernhardt Hamonangan	Laki-Laki	\N	\N	\N	Kerja	0852804988278	Mau Join	Belum CGF	BSD	BSD	Inactive	\N
33	Betania	Perempuan	\N	\N	\N	Kuliah	0895801422709	Sudah Join	Faith	BSD	BSD (Prasmul)	No Information	\N
34	Betsy Kurniawati Witarsa	Perempuan	\N	\N	\N	Kerja	089657599287	Sudah Join	Asin	BSD	BSD	Active	\N
35	Bimo Adji Prasetyo	Laki-Laki	1997-07-08	1997	7	Kerja	085718141825	Sudah Join	Light	Pamulang	Pamulang	Active	\N
36	Brian Chouw	Laki-Laki	1997-07-28	1997	7	Kerja	081234405939	Sudah Tidak Join	Belum CGF	BSD	BSD	Inactive	\N
37	Bryan Hugo Harjono	Laki-Laki	2003-03-01	2003	3	Kerja	08119556955	Mau Join	Belum CGF	BSD	Jl. Laurel South 3 no. 5, Navapark	No Information	\N
162	Joe Fendero	Laki-Laki	\N	\N	\N	Kerja	085715360698	Belum Mau Join	Belum CGF	\N		Active	\N
275	Timothy Secawardaya	Laki-Laki	\N	\N	\N	Kerja	081808561826	Sudah Join	Salt	BSD	BSD	Active	\N
276	Timotius Aubriel	Laki-Laki	2000-12-15	2000	12	Kerja	0821227354080	Sudah Join	Cornerstone	BSD	BSD	Inactive	\N
277	Trissa Lonyka	Perempuan	1998-03-31	1998	3	Kuliah	082112507795	Sudah Join	Light	BSD	BSD	No Information	\N
278	Valencia Devina	Perempuan	2001-11-29	2001	11	Kerja	085770417688	Belum Mau Join	Belum CGF	Pamulang	Pamulang	Active	\N
279	Valentino Imanuel	Laki-Laki	2004-02-22	2004	2	Kuliah	085692244891	Sudah Join	Sabbath	Pamulang	Pamulang	Inactive	\N
281	Vallerie Ann Harjadi	Perempuan	2006-08-29	2006	8	Kuliah	081298926592	Belum Mau Join	Belum CGF	BSD	Visana The Savia K5/15 BSD	Active	\N
313	Yunato	Laki-Laki	1993-06-14	1993	6	Kerja	082122379491	Mau Join	Belum CGF	Pamulang	pamulang	No Information	\N
280	Vallen Nathaniel	Laki-Laki	\N	\N	\N	Kuliah	08111001144	Belum Mau Join	Belum CGF	Alam Sutera	Alam Sutera	Active	masih sering ke cnx
\.


--
-- Data for Name: cnx_jemaat_csv; Type: TABLE DATA; Schema: public; Owner: eraicode
--

COPY public.cnx_jemaat_csv (no_jemaat, nama_jemaat, jenis_kelamin, tanggal_lahir, alamat_domisili, kuliah_kerja, no_handphone, ketertarikan_cgf, nama_cgf) FROM stdin;
12	Alvina Rotua Maharani Tambunan	Perempuan	1/27/1999	BSD	Kerja	081211630473	Sudah join	Cornerstone 
13	Ancillia Wijaya	Perempuan	6/17/1999	Villa Melati Mas Blok I 11 No. 56	Kerja	082213620637	Belum join dan belum mau join	
14	Andreas Calvin Tamara	Laki-Laki	4/17/2000	Manado	Kerja	085342170002	Belum join tapi mau join 	
15	Andrew Halim	Laki-Laki	9/18/1988	Jakarta Barat	Kerja	6282167460828	udah ga join 	udah ga ke cnx
16	Andy Tanumihardja	Laki-Laki	5/30/1992	Buaran, Serpong	Kerja	087777086135	Belum join tapi mau join 	
17	angelina m	Perempuan	8/27/1998	BSD	Kerja	082293968781	Belum join dan belum mau join	
18	Angeline Calista Slamet	Perempuan	1/18/2002	BSD	Kerja	089522333181	Belum join dan belum mau join	
19	Angelique Metta	Perempuan	11/15/2001	 sunter agung, jakarta utara / piazza the mozia	Kerja	085778873151	Belum join tapi mau join 	
20	Angga Avila	Laki-Laki	4/13/1991	Karawaci	Kerja	085163716898	Sudah join	udah balik surabaya
21	Antony Dinata	Laki-Laki	4/22/1994		Kerja	082210198810	Sudah join	Miracle 
22	Ardi Wiriadinata	Laki-Laki		BSD	Kerja	081355132068	Sudah join	Light 
23	Ardya Kristina	Laki-Laki		Serpong Park	Kerja	087871951980	Sudah join	Miracle 
24	Ariel Vito Suyata Ong (Vito)	Laki-Laki	5/11/2002	BSD	Kerja	082283712292	Sudah join	Cornerstone 
25	Armand Pantouw	Laki-Laki		Taman giri loka	Kerja	0811969632	Sudah join	Light 
26	Arnold Enrique Utama	Laki-Laki	3/5/2002	Paviljoen 55	Kerja	085103518518	Belum join dan belum mau join	
27	Aurelua Christie	Perempuan	3/9/2005	Villa Melati Mas B9 	Kuliah	085212159957	Belum join dan belum mau join	
28	Austin Benedict Tambun	Laki-Laki	3/19/2005	Regensi Melati Mas Blok H7 no 7	Kuliah	http://wa.me/6287885582700	Belum join tapi mau join 	
29	Axel Kanata	Laki-Laki			Kuliah	0895602299239	Sudah join	Sabbath
30	Ayu Aprilia	Perempuan		VMM	Kuliah	08111388069	Sudah join	Miracle 
31	Bella Kumalasari	Perempuan	9/22/1993	VMM	Kerja	081283728738	Sudah join	Miracle 
32	Bernhardt Hamonangan	Laki-Laki		BSD	Kerja	0852804988278	Belum join tapi mau join 	
33	Betania (Tania)	Perempuan		BSD (Prasmul)	Kuliah	0895801422709	Sudah join	Faith
34	Betsy Kurniawati Witarsa	Perempuan		BSD	Kerja	089657599287	Sudah join	Asin
35	Bimo Adji Prasetyo	Laki-Laki	7/8/1997	Pamulang	Kerja	085718141825	Sudah join	Light
36	Brian Chouw	Laki-Laki	7/28/1997	BSD	Kerja	081234405939	udah ga join 	udah ga di bsd
37	Bryan Hugo Harjono	Laki-Laki	3/1/2003	Jl. Laurel South 3 no. 5, Navapark	Kerja	http://wa.me/628119556955	Belum join tapi mau join 	
38	Calistha Clementine	Perempuan	2/10/2006	Jl Kayu Putih IV no. 95	Kuliah	087877735240	Belum join dan belum mau join	
39	Calvin yuslianto	Laki-Laki	10/5/2000	Jl mesjid, sumatra utara, medan barat	Kerja	6282366347688	Belum join dan belum mau join	
40	Carlos Antonio Lopulalan	Laki-Laki	5/6/2001	Jalan pisangan raya, cirendeu, ciputat timur, tangerang selatan	Kerja	081357719421	Belum join dan belum mau join	
41	Caroline Avery Tanto	Perempuan		BSD	Kuliah	+6285210037800	Sudah join	Faith 
42	Catherine	Perempuan	1/8/2000	Gading Serpong 7A	Kerja		Sudah join	Grace 
43	Cecilia Verna Wijaya	Perempuan	9/14/1996	Villa Melati Mas (VMM)	Kerja	081296366520	Sudah join	Miracle 
44	Celine Angelin	Perempuan	7/3/2004	Navapark BSD	Kuliah	089699733753	Belum join tapi mau join 	
45	Celine Angelina Tiro	Perempuan	1/23/2007	Strozzi timur 6, no.1 Gading Serpong	Kuliah	6282210902007	Belum join tapi mau join 	
46	Charissa Wicaksana	Perempuan	7/16/1993	Reni jaya blok c17 no 11 pondok petir bojongsari depok	Kerja	081399210495	Sudah join	Cornerstone 
47	Charlene Ardine Charity	Perempuan		BSD	Kerja	081386185810	Belum join tapi mau join 	
48	Cheryl Aldora	Perempuan		VMM	Kerja	081932982818	Sudah join	Asin 
49	Christian Liecarles	Laki-Laki	4/26/2007	Jl krisasana no 78 c	Kuliah	http://wa.me/0895326161968	Belum join dan belum mau join	
50	Christie Priscilla Ngantung	Perempuan		BSD	Kerja	087877439296	Sudah join	Salt 
51	Christina Marsela (Wawa)	Perempuan	3/17/1995	Kebayoran Baru	Kerja	085314528899	Sudah join	Cornerstone 
52	Christopher Eben Kurniawan (Topher, Eben)	Laki-Laki	8/27/1999	BSD	Kerja	087809080019	Sudah join	Cornerstone 
53	Christopher Pranoto (Cepe)	Laki-Laki	1/3/2001	Jakarta	Kerja	08119880659	Sudah join	Asin
54	Christy Nathania 	Perempuan	8/24/1997	VMM	Kerja	089602852821	Sudah join	Miracle 
55	Cindy Valencia S	Perempuan	1/4/2002	Ampera IV no. 19. Jakarta	Kerja	081249004646	udah ga join 	
56	Clarisa Manuela	Perempuan	6/15/2002	BSD	Kerja	08111000569	Sudah join	Pathaway
57	Classico Joydie Sumendap (Ciko)	Laki-Laki		BSD	Kuliah	085157078122	Sudah join	Peace
58	Claudia Arantha	Perempuan	5/26/1996	BSD	Kerja	‪+6287774054420‬	Sudah join	Cornerstone 
59	claudia silviany	Perempuan	1/22/1997	metro sunter blok L nomor 8	Kerja	http://wa.me/6281268005773	Belum join dan belum mau join	
60	clementine biancalista	Perempuan	5/21/2007	villa melati mas blok L2 no 22A	Kuliah	08119740121	Belum join tapi mau join 	
61	Conrad Ariando Sahat Tambunan	Laki-Laki	7/27/2002	Jalan Palm Kuning IV Blok BE No 2 Griya Loka BSD Sektor 1.3	Kerja	085214951127	Belum join tapi mau join 	
62	Daniel Citra	Laki-Laki	8/30/1997		Kerja	085711544980	Sudah join	Grace 
63	Daniel Kho	Laki-Laki	4/11/2002		Kerja	081388702830	Sudah join	Pathaway
64	Daniel Koesno	Laki-Laki	7/2/2000	Gading Serpong	Kerja	085219454579	Sudah join	Grace 
65	Darrell Jeremy	Laki-Laki	5/20/2005	Jakarta Barat	Kuliah	085894333011	Belum join dan belum mau join	
66	Darryn Emilio Nathaniel	Laki-Laki	7/15/2003	Bencongan	Kerja	082190294730	Belum join dan belum mau join	
67	David Ssaputra Wijaya	Laki-Laki	4/19/2005	Datrus Garden Reni Jaya Lama Pondok Petir	Kuliah		Belum join dan belum mau join	
68	Debora Emmanuel (Debbie)	Perempuan	4/13/2002	BSD	Kerja	081585090800	Sudah join	Pathaway
69	Della Puspanegara	Perempuan		Nomaden : Jakarta / BSD / Alam Sutera	Kerja	081294453750	Belum join dan belum mau join	
70	Dhea Agatha Andrian	Perempuan	10/17/2001	Jalan Raya Cisauk Lapan, Kabupaten Tangerang	Kerja	08117172145	Belum join tapi mau join 	
71	Diego Tristan	Laki-Laki	4/17/2005	Apartemen skyhousw tower leonie	Kuliah	089529031056	Sudah join	Peace 
72	Dustin Pradipta	Laki-Laki	9/16/1996	BSD		087880288500	Belum join tapi mau join 	
73	Ebenezer Setiawan (Eben)	Laki-Laki	10/5/1995	BSD	Kerja	0817247225	Sudah join	Asin
74	Edsel mahadika liyis	Laki-Laki	4/29/1995	Apartemen collins	Kerja	087875109593	Belum join tapi mau join 	
75	Edward Renaldi (Ewa)	Laki-Laki	9/21/1999	BSD	Kerja	081289686449	Sudah join	Peace 
76	Eirene Christy Oktarosa Bayu	Perempuan	10/7/1997	Tangerang	Kerja	http://wa.me/6282210314952	Belum join tapi mau join 	
77	Elaine Natalia Parulian Tampubolon	Perempuan	12/25/2006	Serpong Green Park blok L, no. 3AB	Kuliah	0816944211	Belum join tapi mau join 	
78	Eldwin Manuel	Laki-Laki			Kuliah	‪+62895365240247‬	udah ga join 	udah ga di bsd 
79	Eliadi Zalukhu	Laki-Laki	1/16/2004	Tangerang	Kuliah	082260305286	Belum join tapi mau join 	
80	Elisabet meisa 	Perempuan	5/16/2001		Kerja	081210469462	Belum join tapi mau join 	
81	Elizabeth Jenny Trixie	Perempuan	1/1/1998		Kerja	+6285770832323	Sudah join	Cornerstone 
82	Elsa Kristina	Perempuan			Kerja	081212072151	Sudah join	Asin
83	Emilius Filibertsus Lisiender (Emil)	Laki-Laki	9/2/2003	Jakarta	Kuliah	081383739491	Sudah join	Pathaway
84	Emily Ann	Perempuan	10/6/2002	BSD Visana At The Savia K5/15	Kerja	081233569035	Belum join dan belum mau join	
85	Emmanuel Gultom (Noel) 	Laki-Laki	4/26/1999	BSD 	Kerja	+821042646580	Sudah join	Miracle 
86	Epseen	Laki-Laki	5/4/2001	BSD 	Kerja	082136955686	Sudah join	Sabbath
87	erika	Perempuan	1/21/2004	BSD 	Kuliah	085786988771	Belum join dan belum mau join	
88	Ernest Manuel Sowandi	Laki-Laki	4/10/2000	BSD 	Kuliah	085880699608	Sudah join	Miracle 
89	Eunice Nahiman Turjono	Perempuan	5/22/2000	BSD 	Kerja	081908081360	Sudah join	Miracle 
90	Evellyn 	Perempuan	11/13/2005	Alam Sutera	Kuliah	087899539768	Belum join dan belum mau join	
91	F. Giovanni Adi Kusuma (Ivan)	Laki-Laki		Villa Melati Blok G2 No.13	Kerja	085290747111	Sudah join	Asin
92	Feby Angelica Soewandono (Feby)	Perempuan	10/1/2002	Gading Serpong	Kerja	089605336530	Sudah join	Pathaway
93	Fei Elita 	Perempuan	11/26/1997	Anggrek Loka	Kerja	+6285885338105	Sudah join	Cornerstone 
94	Felicia Natalie	Perempuan	11/28/1997	Villa Melati Mas H7/12A	Kerja	081212488104	Belum join tapi mau join 	
95	Felicia Sarah Wijaya (Fili)	Perempuan	10/16/1997	Regensi Melati Mas	Kerja	083813659041	Sudah join	Miracle
96	Felicya	Perempuan	4/2/1999	Melati Mas	Kerja	08128850355	Belum join dan belum mau join	
97	Felix Nathaniel Surjodinoto 	Laki-Laki	1/5/2005	Villa Melati Mas Blok H7/12A	Kuliah	08111092251	Belum join tapi mau join 	
98	Ferdinand Wijaya Chandra	Laki-Laki	2/14/2001	Villa melati	Kerja	08988396121	Belum join tapi mau join 	
99	Fernando Joshua	Laki-Laki	2/13/1998	Jalan salem 1 no. 13	Kerja	085171597156	Belum join tapi mau join 	
100	Filbert Nathaniel	Laki-Laki		VMM	Kerja	085811511007	Belum join dan belum mau join	
101	Florence Ignatia	Perempuan		BSD	Kerja	087889919398	Sudah join	Asin
102	Frederick Sawedi	Laki-Laki	10/14/2007	Silkwood Residences	Kuliah	0818319838	Belum join dan belum mau join	
103	Frederick Winston Christenshend	Laki-Laki	3/2/2006	pasific garden	Kuliah	082214372492	Belum join tapi mau join 	
104	Frida Indari	Perempuan			Kerja	085724114720	Sudah join	Asin
105	Gabriel Trifajar Siahaan	Laki-Laki		Bintaro	Kuliah	081219856349	Sudah join	Light
106	Gabriela Megumi Kristian	Perempuan		Ruko Newton Barat no 1, Gading Serping	Kuliah	085183162804	Belum join tapi mau join 	
107	Gabriella Rose Gunadi (Gaby)	Perempuan	6/2/2002	BSD	Kerja	089655501721	Sudah join	Light 
108	Gabrielle Budiman - Gaby	Perempuan	9/6/2002	BSD	Kerja	08117496090	Sudah join	Sabbath
109	Gabrielle Priskila	Perempuan	7/28/1998	BSD	Kerja	087881729400	Sudah join	Cornerstone 
110	Geraldy Edson Thamrin (Gerald)	Laki-Laki	4/24/1997	BSD	Kerja	087710920323	Sudah join	Miracle 
111	Gilbert Salomo Karnoabe Nainggolan	Laki-Laki	6/6/2007	Jl. Palm Kuning 1, Blok BC/17, Griya Loka, Sektor 1.3	Kuliah	081292224566	Belum join tapi mau join 	
112	Giovanni Hutagaol (Jovie)	Laki-Laki	7/17/2002	BSD 	Kerja	085886095554	Sudah join	Pathaway
113	Glenn Eric	Laki-Laki	2/4/2001	Sutera delima 60	Kerja	61434242016	Belum join tapi mau join 	
114	Gloria Eirene Setyantoro	Perempuan	10/20/2004	Karawaci	Kuliah	088215386932	Belum join dan belum mau join	
115	Glory Amadea Swabawa	Perempuan	7/20/1995	VMM	Kerja	089661255764	Sudah join	Miracle 
116	Grace Aurelia Agustinus 	Perempuan	9/25/2006	icon bsd, verdanville H7/31	Kuliah	081806027866	Belum join dan belum mau join	
117	Grace Caterina	Perempuan	9/1/1998	Pondok jagung timur, serpong utara	Kerja	08568638420	Belum join tapi mau join 	
118	Grace Felicia	Perempuan	6/25/1999	Taman Surya 5 Blok OO4 No 41 Kalideres Jakarta Barat	Kerja	087788773500	Belum join dan belum mau join	
119	Gracia Hardjasa (Cia)	Perempuan	6/27/2003		Kuliah	085929850627	Sudah join	Light
120	Gustin Finnegan	Laki-Laki	8/4/1997	BSD	Kerja	089698254298	Sudah join	Miracle
121	Haidee Aiditia Iksan	Laki-Laki	2/24/2003	Silkwood Residence	Kuliah	081999352755	Belum join tapi mau join 	
122	Hans Julian Theophilus 	Laki-Laki	7/16/2007	Anggrek Loka 2.2 AC 10	Kuliah	085939572896	Belum join tapi mau join 	
123	Hanz Christian	Laki-Laki	2/2/2004	BSD	Kuliah	85172453770	Belum join tapi mau join 	
124	Harry Ivander	Laki-Laki	1/10/2002	Jakarta selatan	Kerja	08970441666	Belum join dan belum mau join	
125	Heidi Renata Halim	Perempuan	6/24/2002	Allevare A8/2, BSD Cisauk	Kerja	085694733363	Belum join dan belum mau join	
126	Helen Ruth	Perempuan	11/30/2002	BSD	Kerja	+6586219393	Sudah join	Miracle
127	Helena Agnes (Ailin)	Perempuan	9/23/1997	VMM	Kerja	081388125533	Sudah join	Miracle
128	Henokh Ekklesia	Laki-Laki	10/30/2000	Karawaci	Kerja	085716806559 	Sudah join	Cornerstone
130	Indah Marshanda	Perempuan		Gading Serpong	Kuliah		Sudah join	Peace 
131	Indira Hutabarat	Perempuan	8/8/2000	Jatiwaringin, Bekasi	Kerja	8159285099	Belum join dan belum mau join	
132	Irene Angelin	Perempuan	1/15/2002	Navapark BSD	Kerja	0895636168111	Belum join dan belum mau join	
133	Irene Jovita 	Perempuan		Pamulang	Kerja	082233595495	Sudah join	Light
134	Irenerus Ezra (Siong)	Laki-Laki	5/2/1995	BSD	Kerja	8985584906	Sudah join	Salt
8	Alexandro Julio	Laki-Laki	7/9/2005	Malibu Village, Delaplane no 22	Kuliah	628117769968	Belum join tapi mau join 	
135	Isabelle Anastasia	Laki-Laki	4/27/2007	Villa Melati Mas blok G-XI/12A	Kuliah	089506451196	Belum join tapi mau join 	
136	Jackie Leonardy	Laki-Laki	5/24/2000	Madrid ( Work Abroad )	Kerja	085386343638	Sudah join	Miracle
137	Jacob Alianto 	Laki-Laki	7/5/1994	BSD 	Kerja	081977117106	Sudah join	Cornerstone
138	James Jonathan	Laki-Laki	10/6/2000	Gading Serpong	Kerja	82112442594	Belum join dan belum mau join	
139	Janet Christy	Perempuan	11/8/2000	Jl Regensi Melati Mas Blok B3 No 26	Kerja	085719115789	Sudah join	Miracle 
140	Janice Adley	Perempuan		Alam Sutera	Kerja	085155119742	Sudah join	Pathaway
141	Janice Andreas	Perempuan	1/1/2002	Gading serpong	Kerja	81318394147	Belum join tapi mau join 	
142	Jasmine Fidelia Chandra	Perempuan		BSD	Kuliah	081319007980	Sudah join	Faith
143	JASON FERNANDO	Laki-Laki	3/19/2003	Kalimantan	Kuliah	085350461798	Belum join dan belum mau join	
144	Jason Liko 	Laki-Laki	5/5/2005	Palembang	Kuliah	wa.me/6281268005773	Belum join tapi mau join 	
145	Jason Putra Deo	Laki-Laki	9/30/2005	Jl. Rawa Buntu Selatan Blok G1 no 17, sektor 1.1, BSD, Tangerang Selatan	Kuliah	087867583577	Belum join tapi mau join 	
146	Jason Gavrilleo Santoso	Laki-Laki		Alam Sutera	Kuliah	87776746569	Belum join tapi mau join 	
147	Jason Subandi (JJ Cowo)	Laki-Laki		BSD / Bogor	Kuliah	08111325858	Sudah join	Peace
148	Jazzy Gratia Sumendap	Perempuan	3/8/2001	Gading Serpong	Kerja	85156571008	Sudah join	Grace
149	Jenifer	Perempuan	11/1/2001	The Avani Deshna	Kerja	081251790688	Belum join tapi mau join 	
150	Jennifer Lowell	Perempuan	6/19/2001	BSD	Kerja	8812123232	Belum join dan belum mau join	
151	Jeprijal bamen	Laki-Laki	4/20/1995	BSD	Kerja	085337245353	Sudah join	Cornerstone
152	Jeremy Claudio Wijaya (Jay/Jey)	Laki-Laki		BSD	Kuliah	0812-9894-7542	udah ga join 	
153	Jeremy Lewis Surya Tiro (Jer)	Laki-Laki	8/18/1998	Strozzi timur 6, no.1 Gading Serpong	Kerja	082267001234	Belum join dan belum mau join	
154	Jessica Audrey Tjahjadi	Perempuan	1/8/2007	Nusaloka Blok B1/23	Kuliah	85813072773	Belum join dan belum mau join	
155	Jessica Gabriella	Perempuan					Belum join dan belum mau join	
156	Jessica Octavia	Perempuan	10/12/1992	Villa Melati Mas (VMM)	Kerja	85781084400	Sudah join	Miracle
157	Jessica Yuliana Wibowo (Cing-Cing)	Perempuan	7/17/1996	BSD	Kerja	085297778008	Sudah join	Asin
158	Jessica Alberti Lowell	Perempuan	6/5/2002	BSD	Kerja	08812388989	Sudah join	Peace
159	Jessy Clarissa Wijaya (Jessy)	Perempuan		BSD	Kuliah	08151810000	Sudah join	Peace
160	Joan	Perempuan	1/4/2001	BSD	Kerja	081318372764	Sudah join	Cornerstone
161	Joan Amanda Moningka Wijaya 	Perempuan	9/22/2006	Kubikahomy Apartment 	Kuliah	81547318105	Sudah join	Peace
162	Joe Fendero	Laki-Laki			Kerja	085715360698	Belum join dan belum mau join	
163	Joel Sebastian H	Laki-Laki	08/12/2000			08871336092	Sudah join	Sabbath
164	Joelyna Aurelia Katie Moningka Wijaya	Perempuan	11/22/2007	Kubikahomy	Kuliah	85792107319	Belum join tapi mau join 	
165	Johnny	Perempuan	7/29/1993	Jalan Guru Mughni, Gang Andil 6	Kerja	85703355529	Belum join dan belum mau join	
166	Jonathan Aaron Wijaya (Aaron)	Laki-Laki	9/22/2004	BSD	Kuliah	085738808893	Sudah join	Peace
167	Jonathan Koesno	Laki-Laki			Kerja	081219158259	Sudah join	Grace
168	Jonathan Reynard	Laki-Laki		Apartement M town	Kerja	wa.me/6282276931278	Belum join tapi mau join 	
169	Jonathan Widi Cahyadi (Widi)	Laki-Laki	12/4/1993	Pamulang	Kerja	81212140388	Sudah join	Miracle
170	Jongka Hero	Laki-Laki	6/4/2006	Alam Sutera	Kuliah	85349512971	Belum join dan belum mau join	
171	Jordan Sumardi	Laki-Laki	1/21/1996	puspita loka	Kerja	87883705888	Belum join tapi mau join 	
172	Joseph Laurent	Perempuan	12/16/2005	Maxley Suites	Kuliah	85216122005	Belum join tapi mau join 	
173	Josephine Kalista Utomo	Laki-Laki	11/21/1999	Lippo Cikarang	Kerja	087879112002	Belum join dan belum mau join	
174	Josh Marvel Nathan (Josh)	Laki-Laki	5/15/2002	The Icon BSD	Kerja	087873014204	Sudah join	Cornerstone
175	Joshua Renaldo	Laki-Laki	7/11/1997	Villa Melati Mas (VMM)	Kerja	085280315906	Sudah join	Miracle
176	Josia Joseph Chandra	Laki-Laki					Sudah join	Sabbath
177	Josua hakrio	Laki-Laki	8/17/1997	Palm Merah UL 26	Kerja	82285101455	Belum join tapi mau join 	
178	Jovanca Marvelia Nathaniel	Perempuan	10/27/2007	Tangerang, BSD, The Icon	Kuliah	wa.me/6287885582700	Belum join dan belum mau join	
179	Jovanny Nathania	Perempuan	6/23/2006	Dorm Binus Alsut	Kuliah	811578228	Belum join tapi mau join 	
180	Jovito Colin	Laki-Laki					Belum join dan belum mau join	
181	Joy Milliaan	Laki-Laki	10/31/2001	Kelapa Gading	Kerja	081519986610	Belum join dan belum mau join	
182	Julia	Perempuan	7/8/1998	Batalyon Kav 9	Kerja	085219891478	Belum join tapi mau join 	
183	Julian Suhendra Tjiang	Laki-Laki	7/28/2005	Maxley Suites	Kuliah	087886787285	Belum join dan belum mau join	
184	Julian Tirtadjaja	Laki-Laki	12/12/1995	Villa Melati Mas (VMM)	Kerja	082123229622	Sudah join	Grace
185	Karen Florencia (Karen)	Perempuan		Gading Serpong 7A	Kerja	087760462190	Belum join dan belum mau join	
186	Kathleen Lauren Wahyudo	Perempuan	9/11/2006	Serpong Park F1/38 	Kuliah	088808492655	Belum join tapi mau join 	
187	Kenneth Chuhairy	Laki-Laki	8/17/1996	Giri Loka, BSD	Kerja	0817862555	Sudah join	Miracle 
188	Kerfin 	Laki-Laki	5/21/1995	VMM	Kerja	089530442023	Sudah join	Miracle
189	Kerlvin Liecarles	Laki-Laki	10/8/2002	BSD	Kerja	082210832397	Sudah join	Pathaway
190	Kevin Dallian (KD)	Laki-Laki			Kerja	08115752289	Belum join tapi mau join 	
191	Kevin Saragih	Laki-Laki	1/24/2007	BSD	Kuliah	81282046275	Belum join tapi mau join 	
192	Kezia Angeline (kezia, kezkez, kekez)	Perempuan	9/3/2001	Strozzi timur 6, no.1 Gading Serpong	Kuliah	6282210902001	Sudah join	Light
194	Kimberly	Perempuan	9/9/2000		Kerja	(+)1(424)3957481	Sudah join	Miracle
195	Lionel Nathan	Laki-Laki	11/25/2007	delatinos	Kuliah	81288055789	Belum join dan belum mau join	
196	Lisa Virianti Mulyo	Perempuan				81933133975	Belum join tapi mau join 	
4	Agatha Christie Noviana	Perempuan	9/8/2002	Kalimantan Barat	Kerja	085387859797	Belum join tapi mau join 	
193	Kezia Putri Deo	Perempuan		BSD	Kuliah	087796164664	Sudah join	Faith
197	Luckemeraldo Jardel	Laki-Laki	10/11/2006	BSD	Kuliah	081217378890	Sudah join	Faith
198	Luis Manuel	Laki-Laki	8/15/2002		Kerja	08111000559	Belum join tapi mau join 	
199	Mackanzie Lawrence Anna Wijaya	Perempuan		Serpong	Kuliah	081347482517	Belum join tapi mau join 	
200	Mandy Theodora (Mandy)	Perempuan		Lippo Village	Kuliah	081318511111	Sudah join	Grace
201	Marcel Widjaja	Laki-Laki	6/5/2007	Topaz Timur 1 no 1	Kuliah	wa.me/6285811556828	Belum join dan belum mau join	
202	Marcelino	Laki-Laki	8/11/2006	BSD	Kuliah	81388509442	Sudah join	Peace 
203	Mathew Lambertus Koronpis	Laki-Laki	9/8/2005	Aeston Park	Kuliah	0895806291664	Belum join tapi mau join 	
204	matthew benney	Laki-Laki	12/19/2006	sw	Kuliah	081234683643	Belum join tapi mau join 	
205	Maura Sukamto	Perempuan	2001	Giri Loka, lg kuliah di us	Kuliah	(+)1(708)8826915	Sudah join	Cornerstone
206	Medeline Umboh	Perempuan	4/3/2004	Silkwood Residence	Kerja	wa.me/62895800493047	Belum join tapi mau join 	
207	Megan Evangeline (Megan)	Perempuan	8/20/2004	Gading Serpong	Kuliah	08195588559	Sudah join	Peace
208	Melliani Yulianty (Lim) dipanggil Mel/Mei/Melli	Perempuan		Pamulang	Kerja	081298802653	Belum join tapi mau join 	
209	Merfin	Laki-Laki	5/21/1995	VMM	Kerja	089632001951	Sudah join	Miracle
210	Michael Lika	Laki-Laki	9/16/2007	Greencove Blok A5 No. 27	Kuliah	085212340916	Belum join tapi mau join 	
211	Michelle	Perempuan	4/23/1999	Pluit	Kerja	81310924363	Belum join tapi mau join 	
212	Michelle Caroline Obaja	Perempuan	10/4/2006	Jalan Taman Beryl No. 9, Cluster Beryl, Gading Serpong	Kuliah	081213654097	Belum join tapi mau join 	
213	Michelle Gwylyn Wijaya	Perempuan	4/8/2001	VMM	Kerja	081212870970	Belum join tapi mau join 	
214	mona sinaga	Laki-Laki	12/19/1988	jalan ciater raya blok c nomor 11	Kerja	85312849171	Belum join tapi mau join 	
215	Moris	Laki-Laki				081806167758	Belum join dan belum mau join	
216	Morrison Kristianto	Laki-Laki	7/17/2002	Serpong Regensi Melati Mas Blok E 14 40 Serpong Tangerang Selatan.	Kerja	wa.me/6289665368544	Belum join tapi mau join 	
217	Nadine Eschetetodia	Perempuan		Regensi Melati Mas	Kerja		Belum join dan belum mau join	
218	Naditta Hutagaol	Perempuan	12/1/2006	BSD	Kuliah	085591744749	Sudah join	Faith
219	Naftali Brigitta Gunawan (Naftali)	Perempuan	3/15/2003	Ciater	Kuliah	081282631726	Sudah join	Light
220	Naomi Krisanty	Perempuan		BSD	Kerja	085885105106	Sudah join	Peace
221	Natanezra Souw	Laki-Laki	11/25/1999	East Asia 2 No. 5, Green Lake City	Kerja	085157562236	Belum join dan belum mau join	
222	Nathan Tandra	Laki-Laki	2/3/2006	Alam sutera	Kuliah		Belum join dan belum mau join	
223	Nathania Alethea Rianto Sigit (Thea)	Perempuan	1/8/1998	GS	Kerja	08194849449	Sudah join	Grace
224	Nathania Sofie	Perempuan	10/10/1997	Gading Serpong	Kerja	08997894334	Sudah join	Grace
225	Nathaniel Shawn Edgar Sondakh 	Laki-Laki	12/7/2007	Delatinos D8/16	Kuliah	085220007790	Belum join tapi mau join 	
226	Nevio Nathanael	Laki-Laki		Pavilion Residence A5/7	Kerja	081290224011	Belum join dan belum mau join	
227	Nicholas Gerrard Hermanto	Laki-Laki	7/7/2007	Jl. Flamingo barat no. 52, Cihuni, Pagedangan, Kab. Tangerang, Banten	Kuliah	wa.me/6281385976921	Belum join tapi mau join 	
228	Nichole Christy	Perempuan	7/20/1999	NusaLoka jalan Jawa IX 	Kerja	85780922791	Belum join dan belum mau join	
229	Nicola Melodyta Suryodinoto	Perempuan	1/14/2002	BSD Sektor 1-2, Jl. Magnolia 4 blok F no.7	Kuliah	89502506000	Belum join tapi mau join 	
230	Nicoline Dorothy Santoso (Nicole)	Perempuan	12/8/2005	BSD		08119990812	Belum join tapi mau join 	
232	Olivia Ajani Rori	Perempuan	5/10/2008	the green, cluster royal blossom, blok K.6, no.7, Cilenggang, serpong, TangSel 15310 banten	Kuliah	wa.me/6281388889670	Belum join tapi mau join 	
233	Osbert Nathaniel Wibowo	Laki-Laki	11/9/2001	VMM	Kuliah	085881698702	Sudah join	Pathaway
234	Oswin Suwandi	Laki-Laki	12/11/1999	VMM	Kuliah	087771777154	Sudah join	Miracle
235	Owen	Laki-Laki	9/25/2006	Alam Sutera	Kuliah	087839119783	Belum join tapi mau join 	
236	Owen Siau	Laki-Laki	6/11/2005	Silkwood Residence	Kuliah	087839119783	Belum join tapi mau join 	
237	Pascal Nathaniel	Laki-Laki			Kerja		Belum join dan belum mau join	
238	Patricia Audrey	Laki-Laki	12/20/2003	Atlanta Village	Kerja	81247430521	Belum join dan belum mau join	
239	Patrick Christoper ( Patrick )	Laki-Laki		BSD	Kuliah	081293221250	udah ga join 	
240	Paulus Adi Wau (Adi)	Laki-Laki	8/25/2003	BSD	Kuliah	0895635020257	Sudah join	Light 
241	Phoebe Nathania	Perempuan	11/2/2000	Gading Serpong	Kerja	08111530211	Sudah join	Grace
242	Piter Lius	Laki-Laki	3/19/2002	Jl. Tpu parakan Gg. Samen mena no.134, benda baru	Kerja	085173190341	Belum join dan belum mau join	
243	Prabandana Raditya	Laki-Laki	8/31/2000	The Icon	Kerja	081380859378	Belum join dan belum mau join	
244	Primuadi Bali	Laki-Laki	1/9/1999	BSD	Kerja	082311634560	Sudah join	Sabbath
245	Putri Kasiman 	Laki-Laki	10/25/2005	BSD	Kuliah	087867583546	Sudah join	Faith
246	Ralph	Laki-Laki					udah ga join 	
247	Rayner Gabrielle	Laki-Laki	5/8/2001	Gading Serpong	Kerja	085920339955	Sudah join	Grace
248	Renald Nathaniel Heldi	Laki-Laki	5/29/2002	The Zora BSD City	Kerja	0818319838	Belum join dan belum mau join	
253	Ryan Nathanael Wongso - Ryan	Laki-Laki		Jakarta	Kerja	087843130828	Sudah join	Salt
254	Saint Diven (diven)	Perempuan		Pamulang	Kerja	085883035551	Belum join tapi mau join 	
255	Sam	Laki-Laki	8/7/2003	BSD	Kuliah	081316007035	Sudah join	Pathaway
256	Sarah Lynn	Perempuan	6/16/2003	TangKot Modernland	Kuliah	081388187873	Sudah join	Grace
258	Sean Gabriel	Laki-Laki					udah ga join 	
259	sener alden	Laki-Laki	9/20/2005	maxley suite	Kuliah	http://wa.me/081399131522	Belum join tapi mau join 	
264	Sisilia	Perempuan	3/31/2001	Komplek Batan Indah Blok P No.23	Kerja	0895340841465	Belum join tapi mau join 	
5	Agnes Feby	Perempuan			Kerja	085217186165	Sudah join	Salt
6	Alexander Putera Widjaya 	Laki-Laki	1/18/2008	BSD, Griyaloka, Jalan Cempaka 1, blok H4/4	Kuliah	081212664739	Belum join tapi mau join 	
7	Alexandra Madeline Rachel Boham 	Perempuan	5/17/2005	BSD	Kuliah	081212376714	Sudah join	Faith
9	Alicia Natasha Dynanty	Perempuan	12/29/2000	BSD	Kerja	081293576622	Sudah join	Cornerstone 
10	Allicia Kustanto 	Perempuan		BSD	Kerja	085210221998	Belum join dan belum mau join	Udah ga di bsd
11	Alphasius Omega Dixon	Laki-Laki	5/7/1996	Pamulang 	Kerja	081806167758	Sudah join	Cornerstone 
257	Sean Arden	Laki-Laki		Sunter	Kerja	08161399363	Sudah join	Cornerstone
266	Stephanie Joana	Perempuan			Kerja	081908035450	Sudah join	Salt
267	Stephanie Kowinto	Perempuan	8/19/2007	Alam Sutera	Kuliah	08111908072	Belum join tapi mau join 	
268	Stephen Renaldi	Laki-Laki		BSD	Kerja	081290236252	Belum join dan belum mau join	
269	Steven Timothy Octovian Gans	Laki-Laki	10/16/2004	Cluster Crystal Jln. Crystal Barat no 45, Gading Serpong, Pakulonan Barat, Kelapa Dua, Tangerang	Kuliah	0816302582	Belum join dan belum mau join	
270	Thelissa Levana Zheng (Lissa)	Perempuan	4/15/2004	BSD	Kuliah	081806411504	Sudah join	Pathaway
271	Theresya Christabsl	Perempuan	9/15/2007	The Zora, Bsd city	Kuliah	http://wa.me/62816832688	Belum join dan belum mau join	
272	Tiffani Miracle Yanita	Perempuan	1/8/1996	Skyhouse BSD	Kerja	087851859919	Belum join tapi mau join 	
273	Timothy Frederick Lukas (Timmy)	Perempuan	2/7/1998	VMM	Kerja	0817136270	Sudah join	Miracle
274	Timothy Lewis	Laki-Laki	4/15/2004		Kuliah	082148198080	Belum join dan belum mau join	
275	Timothy Secawardaya (Tim)	Laki-Laki		BSD	Kerja	081808561826	Sudah join	Salt
276	Timotius Aubriel (Timi)	Laki-Laki	12/15/2000	BSD	Kerja	0821227354080	Sudah join	Cornerstone 
277	Trissa Lonyka	Perempuan	3/31/1998	BSD	Kuliah	082112507795	Sudah join	light
278	Valencia Devina	Perempuan	11/29/2001	Pamulang	Kerja	085770417688	Belum join dan belum mau join	
279	Valentino Imanuel	Laki-Laki	2/22/2004	Pamulang	Kuliah	085692244891	Sudah join	Sabbath
280	Vallen Nathaniel (Vallen)	Laki-Laki		Alam Sutera	Kuliah	08111001144	Belum join dan belum mau join	
281	Vallerie Ann Harjadi	Perempuan	8/29/2006	Visana The Savia K5/15 BSD	Kuliah	081298926592	Belum join dan belum mau join	
282	Vanesa	Perempuan	3/16/1999	Regency melati mas blok C6/6	Kerja	08990168893	Sudah join	Miracle
283	Vanessa Danniella (nes)	Perempuan			Kerja	+6289692649731	udah ga join 	udah ga di bsd 
284	Vanessa Evelyn Thamrin (Nessa)	Perempuan	6/17/2004	BSD	Kerja	081808662121	Sudah join	Pathaway
285	Vania	Perempuan	6/28/1996	BSD	Kerja	081908283390	Belum join dan belum mau join	
286	Velica Theophila	Perempuan		Jl Kubis 1 Blok A1 No. 12	Kerja	089522333180	Belum join dan belum mau join	
287	Veronicca (Lie Siauw Ching)	Perempuan	10/3/1999	Gading Icon Apartment, Jakarta	Kerja	082282782770	Belum join tapi mau join 	
288	Vetta Widarto	Perempuan			Kerja	081325902501	Sudah join	Salt 
289	Vidrey 	Perempuan	10/22/2000	BSD	Kerja	082124202722	Sudah join	Cornerstone 
290	Vieka Santoso	Perempuan	1/6/2002	BSD	Kerja	0811140948	Belum join dan belum mau join	
291	Vieta Santoso	Perempuan	4/5/1996	Taman Tirta Golf	Kerja	081297766377	Sudah join	Miracle
292	Vincent Leonardo	Laki-Laki	7/30/2005	VMM	Kuliah	081381818084	Sudah join	Miracle
293	Vincent Nathaniel 	Laki-Laki		Alam Sutera	Kerja	08111772775	Sudah join	
294	Vincentius Adryan Hartono	Laki-Laki	8/25/2007	Puspitaloka blok A5	Kuliah	08121887072	Belum join dan belum mau join	
295	Vinsensius Christopher Nathaniel Arden	Laki-Laki	5/9/2002	Gading Serpong	Kerja	08158039952	Sudah join	Grace 
296	Vioren Defika	Perempuan	5/16/2002	Gading Serpong	Kerja	081289939877	Belum join dan belum mau join	
297	Virgilius Tan 	Laki-Laki		Tangerang	Kerja	085310220766	udah ga join 	
298	Vivian Sumendap	Perempuan		BSD (Kuliah Prasmul)	Kuliah	085325536877	Belum join dan belum mau join	
299	Wahyu Wijaya	Laki-Laki	3/27/2003	Alam Sutera	Kuliah	0817271369	Sudah join	Faith
300	Wiku Melisa 	Perempuan		Jakarta	Kerja	08117044359	Sudah join	Salt
301	William	Laki-Laki	10/26/2001	Jl Laurel South 3/5, Nava Park, BSD, Tangerang	Kerja	http://wa.me/61433846208	Belum join tapi mau join 	
302	William Handel Lowry	Laki-Laki	10/7/1995	BSD	Kerja	82253091274	Sudah join	Cornerstone 
303	Win Tjen	Laki-Laki		BSD	Kuliah	081285001187	Sudah join	Faith
304	Winston	Laki-Laki	3/2/2006	Alam Sutera	Kuliah	082214372492	Belum join dan belum mau join	
305	wisely liu dennis	Laki-Laki	2/11/1994	kresem 2 no 8g	Kerja	087882529388	Belum join dan belum mau join	
306	Wynner Rafaelle	Laki-Laki	8/23/2003	Gading Serpong	Kuliah	087881200862	Sudah join	Pathaway 
307	Wynona	Perempuan			Kuliah	81910470450	Sudah join	Faith, Kuliah ke Amrik
308	Yasmine Nathania	Perempuan		Puspita Loka Jl Lili Blok G3/5	Kerja	085866799881	Belum join tapi mau join 	
1	Abraham Christopher Elgrego (Hanhan)	Laki-Laki	3/15/2002	Gading Serpong	Kerja	081338245611	Sudah join	Pathaway
2	Accoladea Wijaya 	Perempuan	6/1/2003	VMM	Kuliah	0895353279881	Sudah join	Light
3	Agata fortuna	Perempuan	4/21/1998	Tabebuya inspirahaus f5 no 10	Kerja	08115788772	Belum join tapi mau join 	Miracle
129	Hubert Tatra	Laki-Laki	3/7/1999	BSD	Kerja	08117572378	Sudah join	Cornerstone
231	Olivia	Perempuan				088291996778	Sudah join	Grace
249	Riandy W	Laki-Laki	2000	Foresta Raya Cluster Studento	Kerja		Sudah join	Cornerstone 
250	Robert Muliawan Jaya	Laki-Laki	8/9/2002	Jakarta Barat	Kerja	087803120999	Belum join tapi mau join 	
251	Ruth Yura Gracia Gultom (Yura)	Perempuan	4/14/1995	BSD	Kerja	081289480600	Sudah join	Miracle 
252	Ryan Agustian	Laki-Laki	8/30/2001	BSD	Kerja	0895803248903	Belum join dan belum mau join	
260	Septawon	Laki-Laki	9/6/1999	Serpong	Kerja	0812544230549	Belum join tapi mau join 	
261	Serviour Lilihata	Laki-Laki	6/11/2007	Villa Bintaro Regency Blok G3/4, Kec.Pondok Aren, Kota Tangerang Selatan, Banten	Kuliah	082110178535	Belum join tapi mau join 	
262	Sherika Marvella	Perempuan	3/4/2004	marigold BSD City	Kuliah	http://wa.me/08117288890	Belum join tapi mau join 	
263	Silvi Wattimena	Perempuan	9/4/2004	Serpong	Kerja	081273607331	Belum join dan belum mau join	
265	Stanly	Laki-Laki		Gading Serpong 7A	Kerja	08113923278	Sudah join	Grace
309	Yoel Cavello (Cavel)	Laki-Laki	6/5/2000	BSD	Kerja	089679657452	Sudah join	Cornerstone
310	Yohannes Gunawan	Laki-Laki		Jalan raya bukit serua	Kerja	087882178560	Sudah join	Salt 
311	Yosafat Hans Wijaya	Laki-Laki	3/21/1998	Alam Sutera	Kerja	0895336787578	Sudah join	Miracle
312	Yosia Kurnia	Laki-Laki		Daerah BSD	Kerja	081288991321	Sudah join	Salt, lagi rantau ke Salatiga
313	yunato	Laki-Laki	6/14/1993	pamulang	Kerja	http://wa.me/6282122379491	Belum join tapi mau join 	
\.


--
-- Data for Name: cnx_jemaat_status_history; Type: TABLE DATA; Schema: public; Owner: eraicode
--

COPY public.cnx_jemaat_status_history (id, no_jemaat, status, changed_at, reason) FROM stdin;
\.


--
-- Data for Name: event_history; Type: TABLE DATA; Schema: public; Owner: eraicode
--

COPY public.event_history (event_id, event_name, event_date, category, location, description, gcal_event_id, gcal_link, last_synced_at) FROM stdin;
1	Easter Retreat 2025	2025-04-18	Retreat	Villa Istana Bunga, Lembang	Retreat Paskah dengan tema "Kebangkitan dan Harapan Baru" selama 3 hari 2 malam	gcal_abc123	https://calendar.google.com/event?eid=abc123	2025-04-10 08:00:00+00
2	Worship Night Mei	2025-05-17	Monthly	Gedung Gereja Utama	Malam pujian dan penyembahan bulanan dengan tema "Berserah"	gcal_def456	https://calendar.google.com/event?eid=def456	2025-05-10 09:00:00+00
3	Quarterly Fellowship Q2	2025-06-14	Quarterly	Aula Serbaguna Komunitas	Fellowship triwulanan dengan games, makan bersama, dan sharing kesaksian	\N	\N	\N
4	Youth Camp 2025	2025-07-04	Camp	Bumi Perkemahan Cibubur	Kemah pemuda selama 4 hari dengan pelatihan kepemimpinan dan ibadah outdoor	gcal_ghi789	https://calendar.google.com/event?eid=ghi789	2025-06-28 10:00:00+00
5	Worship Night Agustus	2025-08-16	Monthly	Gedung Gereja Utama	Malam pujian dengan tema "Kemerdekaan Sejati"	\N	\N	\N
6	Quarterly Fellowship Q3	2025-09-13	Quarterly	Aula Serbaguna Komunitas	Fellowship triwulanan dengan acara bakar-bakar dan sharing pelayanan	gcal_jkl012	https://calendar.google.com/event?eid=jkl012	2025-09-05 11:00:00+00
7	Family Retreat 2025	2025-10-03	Retreat	Hotel Puncak Pass Resort	Retreat keluarga dengan sesi parenting dan family bonding	gcal_mno345	https://calendar.google.com/event?eid=mno345	2025-09-25 08:00:00+00
8	Worship Night November	2025-11-15	Monthly	Gedung Gereja Utama	Malam pujian dengan tema "Syukur dan Pengharapan"	\N	\N	\N
9	Christmas Service 2025	2025-12-24	Special	Gedung Gereja Utama	Ibadah Natal dengan drama, paduan suara, dan perayaan kelahiran Kristus	gcal_pqr678	https://calendar.google.com/event?eid=pqr678	2025-12-15 09:00:00+00
10	New Year Revival 2026	2026-01-01	Special	Gedung Gereja Utama	Ibadah pergantian tahun dengan doa syafaat dan komitmen baru	gcal_stu901	https://calendar.google.com/event?eid=stu901	2025-12-28 10:00:00+00
11	Quarterly Fellowship Q1 2026	2026-01-17	Quarterly	Aula Serbaguna Komunitas	Fellowship triwulanan awal tahun dengan visi dan tujuan 2026	\N	\N	\N
12	Worship Night Februari	2026-02-14	Monthly	Gedung Gereja Utama	Malam pujian kasih dengan tema "Kasih yang Memulihkan"	gcal_vwx234	https://calendar.google.com/event?eid=vwx234	2026-02-08 08:00:00+00
13	Easter Retreat 2026	2026-04-03	Retreat	Villa Istana Bunga, Lembang	Retreat Paskah dengan tema "Hidup Baru dalam Kristus"	gcal_yza567	https://calendar.google.com/event?eid=yza567	2026-03-28 09:00:00+00
14	Worship Night Maret	2026-03-14	Monthly	Gedung Gereja Utama	Malam pujian dengan tema "Iman yang Teguh"	gcal_bcd890	https://calendar.google.com/event?eid=bcd890	2026-03-08 10:00:00+00
15	Quarterly Fellowship Q2 2026	2026-04-18	Quarterly	Aula Serbaguna Komunitas	Fellowship triwulanan Q2 dengan tema "Pertumbuhan Bersama"	\N	\N	\N
16	Prayer Breakfast	2026-04-04	Monthly	Gedung Gereja Utama	Sarapan doa bersama untuk memulai bulan April dengan syukur	gcal_efg111	https://calendar.google.com/event?eid=efg111	2026-03-30 08:00:00+00
17	Community Service Day	2026-04-05	Special	RPTRA Kalijodo	Pelayanan komunitas membersihkan taman dan berbagi kasih dengan warga sekitar	\N	\N	\N
18	Youth Gathering	2026-04-06	Monthly	Cafe Grace, Kemang	Pertemuan pemuda dengan diskusi dan fellowship santai	gcal_hij222	https://calendar.google.com/event?eid=hij222	2026-04-01 07:00:00+00
19	CGF Leaders Meeting	2026-04-08	Quarterly	Ruang Rapat Gereja Lt. 2	Rapat koordinasi pemimpin CGF untuk program Q2 2026	\N	\N	\N
\.


--
-- Data for Name: event_participation; Type: TABLE DATA; Schema: public; Owner: eraicode
--

COPY public.event_participation (id, event_id, no_jemaat, role, registered_at) FROM stdin;
\.


--
-- Data for Name: pelayan; Type: TABLE DATA; Schema: public; Owner: eraicode
--

COPY public.pelayan (no_jemaat, nama_jemaat, is_wl, is_singer, is_pianis, is_saxophone, is_filler, is_bass_gitar, is_drum, is_mulmed, is_sound, is_caringteam, is_connexion_crew, is_supporting_crew, is_cforce, is_cg_leader, is_community_pic, is_others, total_pelayanan) FROM stdin;
12	Alvina Rotua Maharani Tambunan	1	0	0	0	0	0	0	0	0	0	1	0	1	0	1	1	5
22	Ardi Wiriadinata	0	0	0	0	0	1	0	0	0	0	0	0	0	0	0	1	2
35	Bimo Adji Prasetyo	1	0	0	0	0	0	1	0	0	0	0	0	1	0	0	1	4
48	Cheryl Aldora	0	1	0	0	0	0	0	0	0	0	0	0	0	0	0	0	1
75	Edward Renaldi	1	0	0	0	0	0	0	0	0	1	1	0	1	0	1	0	5
89	Eunice Nahiman Turjono	0	0	0	0	1	0	0	0	0	1	1	0	0	0	0	0	3
92	Feby Angelica Soewandono	0	1	0	0	0	0	0	0	0	0	0	0	1	0	0	1	3
98	Ferdinand Wijaya Chandra	0	0	0	0	0	0	0	1	0	0	0	0	0	0	0	0	1
105	Gabriel Trifajar Siahaan	0	0	1	0	0	0	0	0	0	0	0	0	0	0	0	0	1
121	Haidee Aiditia Iksan	0	0	0	0	0	1	0	0	0	0	0	0	0	0	0	0	1
125	Heidi Renata Halim	0	1	0	0	0	0	0	0	0	0	0	0	0	0	0	1	2
142	Jasmine Fidelia Chandra	0	0	1	0	0	0	0	0	0	0	0	0	1	0	0	0	2
162	Joe Fendero	0	0	0	0	0	0	1	0	0	0	0	0	0	0	0	1	2
166	Jonathan Aaron Wijaya	0	0	0	0	0	0	1	0	0	0	0	0	1	0	0	1	3
189	Kerlvin Liecarles	0	0	0	0	0	0	1	0	0	1	0	0	0	0	0	0	2
209	Merfin	0	0	0	0	0	0	0	1	0	0	0	0	0	0	0	1	2
216	Morrison Kristianto	0	0	0	0	0	0	1	0	0	1	0	0	0	0	0	1	3
219	Naftali Brigitta Gunawan	1	0	0	0	0	0	0	0	0	0	0	0	0	0	0	1	2
223	Nathania Alethea Rianto Sigit	0	0	0	0	0	1	0	0	0	0	0	0	1	0	0	1	3
224	Nathania Sofie	1	0	0	0	0	0	0	0	0	0	0	0	1	0	0	1	3
233	Osbert Nathaniel Wibowo	0	0	1	0	0	0	0	0	0	0	1	0	1	0	0	1	4
239	Patrick Christoper	0	0	0	0	0	1	0	0	0	0	0	0	0	0	0	1	2
247	Rayner Gabrielle	0	0	1	0	0	0	0	0	0	0	0	0	1	0	0	1	3
270	Thelissa Levana Zheng	0	0	1	0	0	0	0	0	0	0	0	0	1	0	0	1	3
276	Timotius Aubriel	1	0	0	0	0	0	0	0	0	0	0	0	1	0	0	1	3
291	Vieta Santoso	0	0	0	0	0	0	1	0	0	0	1	0	0	0	0	0	2
293	Vincent Nathaniel	0	0	0	0	0	0	1	0	0	0	0	0	0	0	0	1	2
302	William Handel Lowry	0	1	0	0	0	0	0	0	0	0	0	0	0	0	0	1	2
129	Hubert Tatra	0	0	1	0	0	0	0	0	0	0	0	0	0	0	0	0	1
249	Riandy W	0	0	0	0	0	1	0	0	0	0	0	0	0	0	0	1	2
251	Ruth Yura Gracia Gultom	0	1	1	0	0	0	0	0	0	1	1	0	0	0	0	1	5
262	Sherika Marvella	0	1	0	0	0	0	0	0	0	0	0	0	0	0	0	0	1
309	Yoel Cavello	0	0	0	0	0	1	0	0	0	0	0	0	1	0	0	0	2
311	Yosafat Hans Wijaya	0	1	0	0	0	0	0	0	0	0	0	0	1	0	0	1	3
46	Charissa Wicaksana	0	1	0	0	0	0	0	0	0	0	0	0	0	0	0	0	1
53	Christopher Pranoto	1	0	0	0	0	0	0	0	0	0	1	0	0	0	0	0	2
240	Paulus Adi Wau	1	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	1
244	Primuadi Bali	0	0	0	0	0	1	0	0	0	0	0	0	0	0	0	1	2
1	Abraham Christopher Elgrego	1	0	0	0	0	0	0	0	0	0	0	0	1	0	0	0	2
161	Joan Amanda Moningka Wijaya	0	0	0	0	0	0	0	0	0	1	1	0	0	0	0	0	2
306	Wynner Rafaelle	0	0	0	0	0	0	0	0	0	0	1	0	0	0	0	0	1
7	Alexandra Madeline Rachel Boham	0	0	0	0	0	0	0	0	0	0	1	0	1	0	0	1	3
25	Armand Pantouw	0	0	0	0	0	0	0	0	0	0	0	0	1	0	0	1	2
34	Betsy Kurniawati Witarsa	0	0	0	0	0	0	0	0	0	0	0	0	1	0	0	1	2
56	Clarisa Manuela	0	0	0	0	0	0	0	0	0	1	0	0	1	0	0	0	2
253	Ryan Nathanael Wongso - Ryan	0	0	0	0	0	0	0	0	0	0	0	0	1	0	0	0	1
299	Wahyu Wijaya	0	0	0	0	0	0	0	0	0	0	0	0	1	0	0	1	2
160	Joan	0	0	0	0	0	0	0	0	0	0	0	0	1	0	0	0	1
91	F. Giovanni Adi Kusuma	0	0	0	0	0	0	0	0	0	0	0	0	1	0	0	0	1
58	Claudia Arantha	0	0	0	0	0	0	0	0	0	1	0	0	0	0	0	0	1
11	Alphasius Omega Dixon	0	0	0	0	0	0	0	0	0	1	0	0	0	0	0	0	1
107	Gabriella Rose Gunadi	0	0	0	0	0	0	0	0	0	1	0	0	0	0	0	0	1
192	Kezia Angeline	0	0	0	0	0	0	0	0	0	1	0	0	0	0	0	0	1
130	Indah Marshanda	0	0	0	0	0	0	0	0	0	1	0	0	0	0	0	1	2
207	Megan Evangeline	0	0	0	0	0	0	0	0	0	1	0	0	0	0	0	1	2
284	Vanessa Evelyn Thamrin	0	0	0	0	0	0	0	0	0	1	0	0	0	0	0	0	1
110	Geraldy Edson Thamrin	0	0	0	0	0	0	0	0	0	1	0	0	1	0	0	0	2
174	Josh Marvel Nathan	0	0	0	0	0	0	0	0	0	1	0	0	0	0	0	0	1
24	Ariel Vito Suyata Ong	0	0	0	0	0	0	0	0	0	1	0	0	0	0	0	0	1
175	Joshua Renaldo	0	0	0	0	0	0	0	0	0	1	0	0	0	0	0	0	1
83	Emilius Filibertsus Lisiender	0	0	0	0	0	0	0	0	0	1	0	0	0	0	0	0	1
\.


--
-- Data for Name: pelayanan_info; Type: TABLE DATA; Schema: public; Owner: eraicode
--

COPY public.pelayanan_info (pelayanan_id, nama_pelayanan) FROM stdin;
70001	Worship Leader
70002	Singer
70003	Pianis
70004	Saxophone
70005	Filler Keyboard
70006	Bass / Gitar
70007	Drum
70008	Multimedia
70009	Sound
70010	Caring Team
70011	Connexion Crew
70012	Supporting Crew
70013	C-Force
70014	Close Group Leader
70015	Community PIC
\.


--
-- Name: _migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eraicode
--

SELECT pg_catalog.setval('public._migrations_id_seq', 4, true);


--
-- Name: cgf_attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eraicode
--

SELECT pg_catalog.setval('public.cgf_attendance_id_seq', 65, true);


--
-- Name: cnx_jemaat_status_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eraicode
--

SELECT pg_catalog.setval('public.cnx_jemaat_status_history_id_seq', 1, false);


--
-- Name: event_history_event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eraicode
--

SELECT pg_catalog.setval('public.event_history_event_id_seq', 1, false);


--
-- Name: event_participation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eraicode
--

SELECT pg_catalog.setval('public.event_participation_id_seq', 1, false);


--
-- Name: _migrations _migrations_filename_key; Type: CONSTRAINT; Schema: public; Owner: eraicode
--

ALTER TABLE ONLY public._migrations
    ADD CONSTRAINT _migrations_filename_key UNIQUE (filename);


--
-- Name: _migrations _migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: eraicode
--

ALTER TABLE ONLY public._migrations
    ADD CONSTRAINT _migrations_pkey PRIMARY KEY (id);


--
-- Name: cgf_attendance cgf_attendance_no_jemaat_cg_id_tanggal_key; Type: CONSTRAINT; Schema: public; Owner: eraicode
--

ALTER TABLE ONLY public.cgf_attendance
    ADD CONSTRAINT cgf_attendance_no_jemaat_cg_id_tanggal_key UNIQUE (no_jemaat, cg_id, tanggal);


--
-- Name: cgf_attendance cgf_attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: eraicode
--

ALTER TABLE ONLY public.cgf_attendance
    ADD CONSTRAINT cgf_attendance_pkey PRIMARY KEY (id);


--
-- Name: cgf_info cgf_info_pkey; Type: CONSTRAINT; Schema: public; Owner: eraicode
--

ALTER TABLE ONLY public.cgf_info
    ADD CONSTRAINT cgf_info_pkey PRIMARY KEY (id);


--
-- Name: cgf_members cgf_members_pkey; Type: CONSTRAINT; Schema: public; Owner: eraicode
--

ALTER TABLE ONLY public.cgf_members
    ADD CONSTRAINT cgf_members_pkey PRIMARY KEY (no_jemaat);


--
-- Name: cnx_jemaat_baru cnx_jemaat_baru_pkey; Type: CONSTRAINT; Schema: public; Owner: eraicode
--

ALTER TABLE ONLY public.cnx_jemaat_baru
    ADD CONSTRAINT cnx_jemaat_baru_pkey PRIMARY KEY (jemaat_baru_id);


--
-- Name: cnx_jemaat_clean cnx_jemaat_clean_pkey; Type: CONSTRAINT; Schema: public; Owner: eraicode
--

ALTER TABLE ONLY public.cnx_jemaat_clean
    ADD CONSTRAINT cnx_jemaat_clean_pkey PRIMARY KEY (no_jemaat);


--
-- Name: cnx_jemaat_csv cnx_jemaat_pkey; Type: CONSTRAINT; Schema: public; Owner: eraicode
--

ALTER TABLE ONLY public.cnx_jemaat_csv
    ADD CONSTRAINT cnx_jemaat_pkey PRIMARY KEY (no_jemaat);


--
-- Name: cnx_jemaat_status_history cnx_jemaat_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: eraicode
--

ALTER TABLE ONLY public.cnx_jemaat_status_history
    ADD CONSTRAINT cnx_jemaat_status_history_pkey PRIMARY KEY (id);


--
-- Name: event_history event_history_pkey; Type: CONSTRAINT; Schema: public; Owner: eraicode
--

ALTER TABLE ONLY public.event_history
    ADD CONSTRAINT event_history_pkey PRIMARY KEY (event_id);


--
-- Name: event_participation event_participation_event_id_no_jemaat_key; Type: CONSTRAINT; Schema: public; Owner: eraicode
--

ALTER TABLE ONLY public.event_participation
    ADD CONSTRAINT event_participation_event_id_no_jemaat_key UNIQUE (event_id, no_jemaat);


--
-- Name: event_participation event_participation_pkey; Type: CONSTRAINT; Schema: public; Owner: eraicode
--

ALTER TABLE ONLY public.event_participation
    ADD CONSTRAINT event_participation_pkey PRIMARY KEY (id);


--
-- Name: pelayan pelayan_pkey; Type: CONSTRAINT; Schema: public; Owner: eraicode
--

ALTER TABLE ONLY public.pelayan
    ADD CONSTRAINT pelayan_pkey PRIMARY KEY (no_jemaat);


--
-- Name: pelayanan_info pelayanan_info_pkey; Type: CONSTRAINT; Schema: public; Owner: eraicode
--

ALTER TABLE ONLY public.pelayanan_info
    ADD CONSTRAINT pelayanan_info_pkey PRIMARY KEY (pelayanan_id);


--
-- Name: idx_attendance_cg_id; Type: INDEX; Schema: public; Owner: eraicode
--

CREATE INDEX idx_attendance_cg_id ON public.cgf_attendance USING btree (cg_id);


--
-- Name: idx_attendance_cg_tanggal; Type: INDEX; Schema: public; Owner: eraicode
--

CREATE INDEX idx_attendance_cg_tanggal ON public.cgf_attendance USING btree (cg_id, tanggal);


--
-- Name: idx_attendance_jemaat_tanggal; Type: INDEX; Schema: public; Owner: eraicode
--

CREATE INDEX idx_attendance_jemaat_tanggal ON public.cgf_attendance USING btree (no_jemaat, tanggal);


--
-- Name: idx_attendance_keterangan; Type: INDEX; Schema: public; Owner: eraicode
--

CREATE INDEX idx_attendance_keterangan ON public.cgf_attendance USING btree (keterangan);


--
-- Name: idx_attendance_no_jemaat; Type: INDEX; Schema: public; Owner: eraicode
--

CREATE INDEX idx_attendance_no_jemaat ON public.cgf_attendance USING btree (no_jemaat);


--
-- Name: idx_attendance_tanggal; Type: INDEX; Schema: public; Owner: eraicode
--

CREATE INDEX idx_attendance_tanggal ON public.cgf_attendance USING btree (tanggal);


--
-- Name: idx_cgf_info_hari; Type: INDEX; Schema: public; Owner: eraicode
--

CREATE INDEX idx_cgf_info_hari ON public.cgf_info USING btree (hari);


--
-- Name: idx_cgf_info_nama; Type: INDEX; Schema: public; Owner: eraicode
--

CREATE INDEX idx_cgf_info_nama ON public.cgf_info USING btree (nama_cgf);


--
-- Name: idx_cgf_members_leader; Type: INDEX; Schema: public; Owner: eraicode
--

CREATE INDEX idx_cgf_members_leader ON public.cgf_members USING btree (is_leader);


--
-- Name: idx_cgf_members_nama_cgf; Type: INDEX; Schema: public; Owner: eraicode
--

CREATE INDEX idx_cgf_members_nama_cgf ON public.cgf_members USING btree (nama_cgf);


--
-- Name: idx_cgf_members_no_jemaat; Type: INDEX; Schema: public; Owner: eraicode
--

CREATE INDEX idx_cgf_members_no_jemaat ON public.cgf_members USING btree (no_jemaat);


--
-- Name: idx_event_history_category; Type: INDEX; Schema: public; Owner: eraicode
--

CREATE INDEX idx_event_history_category ON public.event_history USING btree (category);


--
-- Name: idx_event_history_date; Type: INDEX; Schema: public; Owner: eraicode
--

CREATE INDEX idx_event_history_date ON public.event_history USING btree (event_date);


--
-- Name: idx_event_history_gcal_event_id; Type: INDEX; Schema: public; Owner: eraicode
--

CREATE INDEX idx_event_history_gcal_event_id ON public.event_history USING btree (gcal_event_id);


--
-- Name: idx_event_participation_event; Type: INDEX; Schema: public; Owner: eraicode
--

CREATE INDEX idx_event_participation_event ON public.event_participation USING btree (event_id);


--
-- Name: idx_event_participation_jemaat; Type: INDEX; Schema: public; Owner: eraicode
--

CREATE INDEX idx_event_participation_jemaat ON public.event_participation USING btree (no_jemaat);


--
-- Name: idx_event_participation_role; Type: INDEX; Schema: public; Owner: eraicode
--

CREATE INDEX idx_event_participation_role ON public.event_participation USING btree (role);


--
-- Name: idx_jemaat_bulan_lahir; Type: INDEX; Schema: public; Owner: eraicode
--

CREATE INDEX idx_jemaat_bulan_lahir ON public.cnx_jemaat_clean USING btree (bulan_lahir);


--
-- Name: idx_jemaat_domisili; Type: INDEX; Schema: public; Owner: eraicode
--

CREATE INDEX idx_jemaat_domisili ON public.cnx_jemaat_clean USING btree (kategori_domisili);


--
-- Name: idx_jemaat_gender; Type: INDEX; Schema: public; Owner: eraicode
--

CREATE INDEX idx_jemaat_gender ON public.cnx_jemaat_clean USING btree (jenis_kelamin);


--
-- Name: idx_jemaat_handphone; Type: INDEX; Schema: public; Owner: eraicode
--

CREATE INDEX idx_jemaat_handphone ON public.cnx_jemaat_clean USING btree (no_handphone);


--
-- Name: idx_jemaat_ketertarikan; Type: INDEX; Schema: public; Owner: eraicode
--

CREATE INDEX idx_jemaat_ketertarikan ON public.cnx_jemaat_clean USING btree (ketertarikan_cgf);


--
-- Name: idx_jemaat_kuliah_kerja; Type: INDEX; Schema: public; Owner: eraicode
--

CREATE INDEX idx_jemaat_kuliah_kerja ON public.cnx_jemaat_clean USING btree (kuliah_kerja);


--
-- Name: idx_jemaat_nama; Type: INDEX; Schema: public; Owner: eraicode
--

CREATE INDEX idx_jemaat_nama ON public.cnx_jemaat_clean USING btree (nama_jemaat);


--
-- Name: idx_jemaat_nama_cgf; Type: INDEX; Schema: public; Owner: eraicode
--

CREATE INDEX idx_jemaat_nama_cgf ON public.cnx_jemaat_clean USING btree (nama_cgf);


--
-- Name: idx_pelayan_nama; Type: INDEX; Schema: public; Owner: eraicode
--

CREATE INDEX idx_pelayan_nama ON public.pelayan USING btree (nama_jemaat);


--
-- Name: idx_pelayan_total; Type: INDEX; Schema: public; Owner: eraicode
--

CREATE INDEX idx_pelayan_total ON public.pelayan USING btree (total_pelayanan);


--
-- Name: idx_status_history_changed_at; Type: INDEX; Schema: public; Owner: eraicode
--

CREATE INDEX idx_status_history_changed_at ON public.cnx_jemaat_status_history USING btree (changed_at);


--
-- Name: idx_status_history_jemaat_date; Type: INDEX; Schema: public; Owner: eraicode
--

CREATE INDEX idx_status_history_jemaat_date ON public.cnx_jemaat_status_history USING btree (no_jemaat, changed_at);


--
-- Name: idx_status_history_no_jemaat; Type: INDEX; Schema: public; Owner: eraicode
--

CREATE INDEX idx_status_history_no_jemaat ON public.cnx_jemaat_status_history USING btree (no_jemaat);


--
-- Name: idx_status_history_status; Type: INDEX; Schema: public; Owner: eraicode
--

CREATE INDEX idx_status_history_status ON public.cnx_jemaat_status_history USING btree (status);


--
-- Name: cgf_attendance fk_attendance_cgf; Type: FK CONSTRAINT; Schema: public; Owner: eraicode
--

ALTER TABLE ONLY public.cgf_attendance
    ADD CONSTRAINT fk_attendance_cgf FOREIGN KEY (cg_id) REFERENCES public.cgf_info(id) ON DELETE CASCADE;


--
-- Name: cgf_attendance fk_attendance_jemaat; Type: FK CONSTRAINT; Schema: public; Owner: eraicode
--

ALTER TABLE ONLY public.cgf_attendance
    ADD CONSTRAINT fk_attendance_jemaat FOREIGN KEY (no_jemaat) REFERENCES public.cnx_jemaat_clean(no_jemaat) ON DELETE CASCADE;


--
-- Name: cgf_members fk_cgf_members_jemaat; Type: FK CONSTRAINT; Schema: public; Owner: eraicode
--

ALTER TABLE ONLY public.cgf_members
    ADD CONSTRAINT fk_cgf_members_jemaat FOREIGN KEY (no_jemaat) REFERENCES public.cnx_jemaat_clean(no_jemaat) ON DELETE CASCADE;


--
-- Name: event_participation fk_event_participation_event; Type: FK CONSTRAINT; Schema: public; Owner: eraicode
--

ALTER TABLE ONLY public.event_participation
    ADD CONSTRAINT fk_event_participation_event FOREIGN KEY (event_id) REFERENCES public.event_history(event_id) ON DELETE CASCADE;


--
-- Name: event_participation fk_event_participation_jemaat; Type: FK CONSTRAINT; Schema: public; Owner: eraicode
--

ALTER TABLE ONLY public.event_participation
    ADD CONSTRAINT fk_event_participation_jemaat FOREIGN KEY (no_jemaat) REFERENCES public.cnx_jemaat_clean(no_jemaat) ON DELETE CASCADE;


--
-- Name: pelayan fk_pelayan_jemaat; Type: FK CONSTRAINT; Schema: public; Owner: eraicode
--

ALTER TABLE ONLY public.pelayan
    ADD CONSTRAINT fk_pelayan_jemaat FOREIGN KEY (no_jemaat) REFERENCES public.cnx_jemaat_clean(no_jemaat) ON DELETE CASCADE;


--
-- Name: cnx_jemaat_status_history fk_status_history_jemaat; Type: FK CONSTRAINT; Schema: public; Owner: eraicode
--

ALTER TABLE ONLY public.cnx_jemaat_status_history
    ADD CONSTRAINT fk_status_history_jemaat FOREIGN KEY (no_jemaat) REFERENCES public.cnx_jemaat_clean(no_jemaat) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict ZWTGPPWo9RSv6krORJf1MYoIqvKICLQZFLJ1Wc70d65q5tzrmRgaIXgOBXBzGQa

