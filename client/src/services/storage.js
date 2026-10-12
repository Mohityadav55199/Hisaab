import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { calculateSettlement } from './settlementLogic';

// Storage keys
const STORAGE_KEYS = {
    FRIENDS: '@hisaab_local_friends',
    GROUPS: '@hisaab_local_groups',
    EXPENSES: '@hisaab_local_expenses',
    JOURNEYS: '@hisaab_local_journeys',
};

// Generate UUID or fallback
const generateId = () => {
    try {
        if (Crypto.randomUUID) {
            return Crypto.randomUUID();
        }
    } catch (e) {
        // Fallback
    }
    return `id_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Helper: read JSON array from storage
const getArray = async (key) => {
    try {
        const json = await AsyncStorage.getItem(key);
        return json ? JSON.parse(json) : [];
    } catch (error) {
        console.error(`Error reading ${key} from storage:`, error);
        return [];
    }
};

// Helper: write JSON array to storage
const setArray = async (key, array) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(array));
    } catch (error) {
        console.error(`Error saving ${key} to storage:`, error);
    }
};

// Helper to simulate Axios response shape: { data: ... }
const asResponse = (data) => ({ data });

// Helper to create an error matching Axios error shape: error.response.data.error
const createError = (message, status = 400) => {
    const err = new Error(message);
    err.response = { status, data: { error: message } };
    return err;
};

// ===== USER =====
export const initUser = async (oderId) => {
    return asResponse({ userId: oderId, isNew: false });
};

// ===== PEOPLE =====
export const getPeople = async () => {
    const friends = await getArray(STORAGE_KEYS.FRIENDS);
    return asResponse(friends.map(f => f.name));
};

export const addPerson = async (name) => {
    if (!name || !name.trim()) throw createError('Name is required');
    const trimmed = name.trim();
    const friends = await getArray(STORAGE_KEYS.FRIENDS);

    const exists = friends.some(f => f.name.toLowerCase() === trimmed.toLowerCase());
    if (exists) throw createError('Person already exists');

    const newPerson = { id: generateId(), name: trimmed, createdAt: Date.now() };
    friends.unshift(newPerson);
    await setArray(STORAGE_KEYS.FRIENDS, friends);

    return asResponse({ message: 'Person added', person: newPerson.name });
};

// ===== FRIENDS =====
export const getFriends = async () => {
    const friends = await getArray(STORAGE_KEYS.FRIENDS);
    return asResponse(friends.map(f => ({ id: f.id, name: f.name })));
};

export const addFriend = async (name) => {
    if (!name || !name.trim()) throw createError('Name is required');
    const trimmed = name.trim();
    const friends = await getArray(STORAGE_KEYS.FRIENDS);

    const exists = friends.some(f => f.name.toLowerCase() === trimmed.toLowerCase());
    if (exists) throw createError('Friend already exists');

    const newFriend = { id: generateId(), name: trimmed, createdAt: Date.now() };
    friends.unshift(newFriend);
    await setArray(STORAGE_KEYS.FRIENDS, friends);

    return asResponse({ id: newFriend.id, name: newFriend.name });
};

export const deleteFriend = async (id) => {
    const friends = await getArray(STORAGE_KEYS.FRIENDS);
    const updated = friends.filter(f => f.id !== id);
    await setArray(STORAGE_KEYS.FRIENDS, updated);
    return asResponse({ message: 'Friend deleted' });
};

// ===== GROUPS =====
export const getGroups = async () => {
    const groups = await getArray(STORAGE_KEYS.GROUPS);
    return asResponse(groups.map(g => ({
        id: g.id,
        name: g.name,
        members: g.members || []
    })));
};

export const addGroup = async ({ name, members }) => {
    if (!name || !name.trim()) throw createError('Group name is required');
    if (!members || members.length === 0) throw createError('At least one member is required');

    const trimmed = name.trim();
    const groups = await getArray(STORAGE_KEYS.GROUPS);

    const exists = groups.some(g => g.name.toLowerCase() === trimmed.toLowerCase());
    if (exists) throw createError('Group already exists');

    const newGroup = {
        id: generateId(),
        name: trimmed,
        members,
        createdAt: Date.now()
    };
    groups.unshift(newGroup);
    await setArray(STORAGE_KEYS.GROUPS, groups);

    return asResponse({ id: newGroup.id, name: newGroup.name, members: newGroup.members });
};

export const deleteGroup = async (id) => {
    const groups = await getArray(STORAGE_KEYS.GROUPS);
    const updated = groups.filter(g => g.id !== id);
    await setArray(STORAGE_KEYS.GROUPS, updated);
    return asResponse({ message: 'Group deleted' });
};

// ===== EXPENSES =====
export const getExpenses = async () => {
    const expenses = await getArray(STORAGE_KEYS.EXPENSES);
    // Sort descending by timestamp
    expenses.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    return asResponse(expenses);
};

export const addExpense = async (expenseData) => {
    const { payer, amount, beneficiaries, description, splitType, splits } = expenseData;

    if (!payer || !amount || !beneficiaries || beneficiaries.length === 0) {
        throw createError('Invalid expense data');
    }

    if (splitType === 'unequal' && splits) {
        const totalSplits = Object.values(splits).reduce((sum, val) => sum + parseFloat(val || 0), 0);
        if (Math.abs(totalSplits - parseFloat(amount)) > 0.01) {
            throw createError('Split amounts must equal total expense amount');
        }
    }

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    const newExpense = {
        id: generateId(),
        payer,
        amount: parseFloat(amount),
        description: description || '',
        beneficiaries,
        splitType: splitType || 'equal',
        splits: splits || null,
        date: dateFormatted,
        timestamp: Date.now()
    };

    const expenses = await getArray(STORAGE_KEYS.EXPENSES);
    expenses.unshift(newExpense);
    await setArray(STORAGE_KEYS.EXPENSES, expenses);

    return asResponse(newExpense);
};

export const deleteExpense = async (id) => {
    const expenses = await getArray(STORAGE_KEYS.EXPENSES);
    const updated = expenses.filter(e => e.id !== id);
    await setArray(STORAGE_KEYS.EXPENSES, updated);
    return asResponse({ message: 'Expense deleted successfully' });
};

// ===== ACTIVITY =====
export const getActivity = async () => {
    const expenses = await getArray(STORAGE_KEYS.EXPENSES);
    expenses.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    return asResponse(expenses);
};

// ===== SETTLEMENT =====
export const getSettlement = async () => {
    const friends = await getArray(STORAGE_KEYS.FRIENDS);
    const expenses = await getArray(STORAGE_KEYS.EXPENSES);

    const persons = friends.map(f => f.name);
    const result = calculateSettlement(persons, expenses);
    return asResponse(result);
};

// ===== RESET =====
export const resetData = async () => {
    await setArray(STORAGE_KEYS.EXPENSES, []);
    return asResponse({ message: 'Data reset' });
};

// ===== JOURNEYS =====
export const getJourneys = async () => {
    const journeys = await getArray(STORAGE_KEYS.JOURNEYS);
    journeys.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    return asResponse(journeys);
};

export const archiveJourney = async (name) => {
    if (!name || !name.trim()) throw createError('Journey name is required');

    const friends = await getArray(STORAGE_KEYS.FRIENDS);
    const expenses = await getArray(STORAGE_KEYS.EXPENSES);

    const persons = friends.map(f => f.name);
    const settlements = calculateSettlement(persons, expenses);

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    const newJourney = {
        id: generateId(),
        name: name.trim(),
        date: dateFormatted,
        timestamp: Date.now(),
        expenses: [...expenses],
        settlements,
        totalAmount: expenses.reduce((sum, e) => sum + e.amount, 0),
        expenseCount: expenses.length,
        peopleCount: persons.length
    };

    const journeys = await getArray(STORAGE_KEYS.JOURNEYS);
    journeys.unshift(newJourney);
    await setArray(STORAGE_KEYS.JOURNEYS, journeys);

    // Clear active expenses (keep friends and groups)
    await setArray(STORAGE_KEYS.EXPENSES, []);

    return asResponse(newJourney);
};

export const deleteJourney = async (id) => {
    const journeys = await getArray(STORAGE_KEYS.JOURNEYS);
    const updated = journeys.filter(j => j.id !== id);
    await setArray(STORAGE_KEYS.JOURNEYS, updated);
    return asResponse({ message: 'Journey deleted successfully' });
};
