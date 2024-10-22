import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import {User} from "./users.entity";


@Entity('devices')
export class Device {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    deviceId: string;

    @Column()
    browserName: string;

    @Column()
    deviceName: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    lastActive: Date;

    @ManyToOne(() => User, user => user.devices)
    user: User; // Create a relation with RegisteredUser
}
