export function formatPrice(value:number){
 return new Intl.NumberFormat("vi-VN",{
   style:"currency",
   currency:"VND",
   maximumFractionDigits:0
 }).format(value)
}

export function formatDate(iso:string){
 return new Date(iso).toLocaleDateString(
   "vi-VN",
   {
      day:"numeric",
      month:"long",
      year:"numeric"
   }
 )
}