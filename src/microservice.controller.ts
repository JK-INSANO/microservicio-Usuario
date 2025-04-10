import { Controller } from '@nestjs/common';
import { MessagePattern, EventPattern } from '@nestjs/microservices';

@Controller()
export class MicroserviceController {
  @MessagePattern({ cmd: 'ping' })
  ping(data: any): string {
    console.log('Received ping command with data:', data);
    return 'pong';
  }

  @MessagePattern({ cmd: 'sum' })
  sum(data: number[]): number {
    console.log('Received sum command with data:', data);
    return (data || []).reduce((a, b) => a + b, 0);
  }

  @EventPattern('user_created')
  handleUserCreated(data: Record<string, any>) {
    console.log('User created event received:', data);
    // Handle the event (e.g., send email, update cache, etc.)
  }
}
