export interface RequestMessageResponse {
  property: string;
  value: string;
  target: {
    [key: string]: string | number | boolean;
  };
  children: [];
  constraints: {
    [key: string]: string | number | boolean;
  };
}
