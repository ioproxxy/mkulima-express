import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, NavLink, useNavigate, Navigate, useLocation, useParams } from 'react-router-dom';
import { ToastContainer, toast, TypeOptions } from 'react-toastify';
import { User, UserRole, Produce, Contract, ContractStatus } from './types';
import { useAuth, AuthProvider } from './contexts/AuthContext';
import { useData, DataProvider } from './contexts/DataContext';

// --- ICONS --- //
const HomeIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.n