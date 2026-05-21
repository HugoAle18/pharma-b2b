import Link from "next/link";
import { Grid, FileText, Package, ArrowRight, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight text-[#0066CC]">
              Pharma<span className="text-[#003366]">B2B</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-[#0066CC] transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/registro"
              className="text-sm font-medium bg-[#0066CC] hover:bg-[#0055b3] text-white px-4 py-2 rounded-lg transition-all shadow-sm"
            >
              Solicitar acceso
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50/30 py-20 lg:py-32 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-sm font-semibold text-[#0066CC] mb-6">
              <ShieldCheck className="h-4 w-4" /> Portal Exclusivo para Distribuidores y Farmacias
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#003366] leading-tight">
              Distribución farmacéutica B2B — <br />
              <span className="text-[#0066CC]">Tu proveedor de confianza</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl">
              Accede a nuestro catálogo completo, gestiona cotizaciones y realiza el seguimiento de tus pedidos desde un solo lugar de manera digital y segura.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/registro"
                className="inline-flex items-center justify-center bg-[#0066CC] hover:bg-[#0055b3] text-white text-base font-semibold px-6 py-3.5 rounded-lg shadow-md transition-all hover:scale-[1.01]"
              >
                Solicitar acceso <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-base font-semibold px-6 py-3.5 rounded-lg shadow-sm transition-all"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-[#003366] sm:text-4xl">
              Solución integral para tu farmacia o negocio
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Automatizamos el proceso de abastecimiento de medicamentos e insumos médicos con un flujo ágil e inmediato.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="relative flex flex-col p-8 bg-white border border-gray-150 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="p-3 bg-blue-50 text-[#0066CC] rounded-xl w-fit mb-6">
                <Grid className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#003366] mb-3">Catálogo Completo</h3>
              <p className="text-gray-600 leading-relaxed">
                Accede a una amplia variedad de productos farmacéuticos catalogados por categoría con precios unitarios y por caja, y control de stock en tiempo real.
              </p>
            </div>

            {/* Card 2 */}
            <div className="relative flex flex-col p-8 bg-white border border-gray-150 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="p-3 bg-blue-50 text-[#0066CC] rounded-xl w-fit mb-6">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#003366] mb-3">Cotizaciones en Línea</h3>
              <p className="text-gray-600 leading-relaxed">
                Prepara cotizaciones borrador basadas en tus compras habituales y envíalas directamente para recibir una aprobación ágil y rápida del equipo.
              </p>
            </div>

            {/* Card 3 */}
            <div className="relative flex flex-col p-8 bg-white border border-gray-150 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="p-3 bg-blue-50 text-[#0066CC] rounded-xl w-fit mb-6">
                <Package className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#003366] mb-3">Seguimiento en Tiempo Real</h3>
              <p className="text-gray-600 leading-relaxed">
                Sigue la evolución de tus pedidos desde que son confirmados hasta su despacho y entrega final en tus almacenes mediante nuestra línea de tiempo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-gray-50 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-[#003366] sm:text-4xl">
              ¿Cómo funciona?
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Sigue estos tres sencillos pasos para empezar a operar con nosotros.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#0066CC] text-white text-xl font-bold mb-6 shadow-md shadow-blue-200">
                1
              </div>
              <h3 className="text-lg font-bold text-[#003366] mb-2">Solicita tu Cuenta</h3>
              <p className="text-gray-600 max-w-xs">
                Registra tus datos y los de tu empresa (incluyendo RUC). Nuestro equipo revisará la información para autorizar tu acceso.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#0066CC] text-white text-xl font-bold mb-6 shadow-md shadow-blue-200">
                2
              </div>
              <h3 className="text-lg font-bold text-[#003366] mb-2">Cotiza en el Catálogo</h3>
              <p className="text-gray-600 max-w-xs">
                Una vez aprobado tu acceso, navega por el catálogo de medicamentos, añade productos al carrito y genera una cotización.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#0066CC] text-white text-xl font-bold mb-6 shadow-md shadow-blue-200">
                3
              </div>
              <h3 className="text-lg font-bold text-[#003366] mb-2">Confirma y Recibe</h3>
              <p className="text-gray-600 max-w-xs">
                Envía tu cotización borrador para que sea aprobada. Conviértela en pedido para iniciar la preparación, despacho y entrega de tus insumos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#003366] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-b border-blue-900 pb-8 mb-8">
            <div>
              <span className="text-2xl font-bold tracking-tight text-white block mb-4">
                Pharma<span className="text-blue-300">B2B</span>
              </span>
              <p className="text-blue-100 max-w-sm">
                Simplificando el abastecimiento médico a nivel nacional con transparencia, rapidez y seguridad.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:items-end text-blue-100">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-300" />
                <span>+51 (01) 555-0199</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-300" />
                <span>contacto@pharmab2b.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-300" />
                <span>Av. Salud 456, San Isidro, Lima</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-blue-200">
            <p>&copy; {new Date().getFullYear()} PharmaB2B. Todos los derechos reservados.</p>
            <p className="mt-2 sm:mt-0 text-xs">Exclusivo para uso comercial y farmacéutico regulado.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
