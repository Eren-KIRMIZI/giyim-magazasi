import * as React from 'react';
import {
  Html,
  Body,
  Head,
  Heading,
  Hr,
  Container,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from '@react-email/components';

interface OrderConfirmationEmailProps {
  customerName: string;
  orderNumber: string;
  totalAmount: string;
  items: Array<{ name: string; quantity: number; size?: string | null }>;
}

export const OrderConfirmationEmail = ({
  customerName,
  orderNumber,
  totalAmount,
  items,
}: OrderConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Siparişiniz Onaylandı - {orderNumber}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Siparişiniz Onaylandı</Heading>
        <Text style={text}>Merhaba {customerName || 'Değerli Müşterimiz'},</Text>
        <Text style={text}>
          Siparişiniz başarıyla alınmıştır ve hazırlanmaya başlanmıştır. Sipariş detaylarınızı aşağıda bulabilirsiniz.
        </Text>
        <Section style={orderSection}>
          <Text style={orderNumberText}>Sipariş No: {orderNumber}</Text>
          <Hr style={hr} />
          {items.map((item, index) => (
            <Row key={index} style={itemRow}>
              <Column>
                <Text style={itemText}>
                  {item.name} {item.size ? `(${item.size})` : ''} x {item.quantity}
                </Text>
              </Column>
            </Row>
          ))}
          <Hr style={hr} />
          <Row>
            <Column>
              <Text style={totalText}>Toplam Tutar:</Text>
            </Column>
            <Column align="right">
              <Text style={totalAmountText}>{totalAmount}</Text>
            </Column>
          </Row>
        </Section>
        <Text style={footerText}>Bizi tercih ettiğiniz için teşekkür ederiz!</Text>
        <Text style={footerText}>LAST DANCE Ekibi</Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  padding: '30px',
  margin: '0',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 40px',
};

const orderSection = {
  padding: '20px 40px',
  backgroundColor: '#f9f9f9',
  margin: '20px 40px',
  borderRadius: '4px',
};

const orderNumberText = {
  fontWeight: 'bold',
  fontSize: '16px',
  marginBottom: '10px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const itemRow = {
  marginBottom: '10px',
};

const itemText = {
  fontSize: '14px',
  color: '#555',
  margin: '0',
};

const totalText = {
  fontWeight: 'bold',
  fontSize: '16px',
};

const totalAmountText = {
  fontWeight: 'bold',
  fontSize: '18px',
  color: '#111',
};

const footerText = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 40px',
  textAlign: 'center' as const,
};
