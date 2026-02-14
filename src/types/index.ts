export interface CartaoFormData {
  numeroCartao: string;
  validade: string;
  cvv: string;
}

export interface VerificationResult {
  valido: boolean;
  vazado: boolean;
  mensagem: string;
}

export interface CartaoSalvo {
  id: number;
  numero_cartao: string;
  validade: string;
  cvv: string;
  valido: boolean;
  vazado: boolean;
  created_at: string;
}
