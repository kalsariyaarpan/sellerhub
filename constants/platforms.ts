export const platforms = [
  { id: 'meesho', name: 'Meesho', mark: 'm', color: '#9D216D', description: 'Meesho Supplier Panel', url: 'https://supplier.meesho.com/' },
  { id: 'flipkart', name: 'Flipkart', mark: 'F', color: '#2052A5', description: 'Flipkart Seller Hub', url: 'https://seller.flipkart.com/' },
  { id: 'amazon', name: 'Amazon', mark: 'a', color: '#252F3E', description: 'Amazon Seller Central India', url: 'https://sellercentral.amazon.in/' },
  { id: 'myntra', name: 'Myntra', mark: 'M', color: '#C32659', description: 'Myntra Partner Portal', url: 'https://partners.myntrainfo.com/' },
  { id: 'ajio', name: 'Ajio', mark: 'AJ', color: '#384B58', description: 'AJIO Commerce Seller Central', url: 'https://seller.ajio.com/ajiocommerce/' },
  { id: 'snapdeal', name: 'Snapdeal', mark: 'S', color: '#D11B4A', description: 'Snapdeal Seller Zone', url: 'https://seller.snapdeal.com/' },
] as const;

export type Platform = (typeof platforms)[number];
export type PlatformId = Platform['id'];
