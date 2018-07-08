--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.8
-- Dumped by pg_dump version 9.6.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: nrd_version_ver; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.nrd_version_ver (
    pk_ver_id integer NOT NULL,
    ver_name text NOT NULL,
    ver_content json
);


ALTER TABLE public.nrd_version_ver OWNER TO root;

--
-- Name: nrd_version_ver_pk_ver_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.nrd_version_ver_pk_ver_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.nrd_version_ver_pk_ver_id_seq OWNER TO root;

--
-- Name: nrd_version_ver_pk_ver_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.nrd_version_ver_pk_ver_id_seq OWNED BY public.nrd_version_ver.pk_ver_id;


--
-- Name: nrd_version_ver pk_ver_id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.nrd_version_ver ALTER COLUMN pk_ver_id SET DEFAULT nextval('public.nrd_version_ver_pk_ver_id_seq'::regclass);


--
-- Name: nrd_version_ver nrd_version_ver_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.nrd_version_ver
    ADD CONSTRAINT nrd_version_ver_pkey PRIMARY KEY (pk_ver_id);


--
-- Name: nrd_version_ver nrd_version_ver_ver_name_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.nrd_version_ver
    ADD CONSTRAINT nrd_version_ver_ver_name_key UNIQUE (ver_name);


--
-- PostgreSQL database dump complete
--

