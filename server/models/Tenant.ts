import mongoose, { Schema, Document } from 'mongoose';

export interface ITenant extends Document {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    transactions: mongoose.Types.ObjectId[];
}

const TenantSchema = new Schema<ITenant>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }]
}, { timestamps: true });

export default mongoose.model<ITenant>('Tenant', TenantSchema);
