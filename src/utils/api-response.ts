export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message: string;
  statusCode: number;
  error?: any;
}

export class ResponseFormatter {
  static success<T>(
    data: T,
    message: string = 'Success',
    statusCode: number = 200
  ): ApiResponse<T> {
    return {
      data,
      success: true,
      message,
      statusCode: statusCode
    };
  }

  static error(
    message: string = 'An error occurred',
    statusCode: number = 500,
    error?: any,
    data: any = null
  ): ApiResponse {
    const response: ApiResponse = {
      data,
      success: false,
      message,
      statusCode: statusCode
    };

    if (error) response.error = error;
    return response;
  }
}
