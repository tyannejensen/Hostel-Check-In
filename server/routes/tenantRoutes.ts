import express, { Request, Response } from 'express';
import Tenant, { ITenant } from '../models/Tenant';

const router = express.Router();

// Get All Tenants
router.get('/', async (_req: Request, res: Response) => {
    try {
        const tenants: ITenant[] = await Tenant.find();
        res.status(200).json(tenants);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Add a New Tenant
router.post('/', async (req: Request, res: Response) => {
    const { firstName, lastName, phoneNumber } = req.body;

    try {
        const newTenant: ITenant = new Tenant({ firstName, lastName, phoneNumber });
        await newTenant.save();
        res.status(201).json(newTenant);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
