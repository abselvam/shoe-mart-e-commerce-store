function Footer() {
  return (
    <>
      <div className="h-110 bg-primary py-10 hidden md:flex flex-col mt-20">
        <div className="flex items-center justify-center gap-48">
          <div className="flex flex-col text-primary-foreground">
            <h1 className="text-lg font-semibold mb-4">Resources</h1>
            <p className="my-1">Find a Store</p>
            <p className="my-1">Become a Member</p>
            <p className="my-1">Affiliate Program</p>
            <p className="my-1">Send Us Feedback</p>
          </div>
          <div className="flex flex-col text-primary-foreground">
            <h1 className="text-lg font-semibold mt-6 mb-3">Help</h1>
            <p className="my-1">Get Help</p>
            <p className="my-1">Order Status</p>
            <p className="my-1">Delivery</p>
            <p className="my-1">Returns</p>
            <p className="my-1">FAQ</p>
          </div>
          <div className="flex flex-col text-primary-foreground">
            <h1 className="text-lg font-semibold mb-5">Company</h1>
            <p className="my-1">About Shoe Mart</p>
            <p className="my-1">News</p>
            <p className="my-1">Investors</p>
            <p className="my-1">Report a Concern</p>
          </div>
        </div>

        <div className="flex ml-90 mt-25 items-center text-primary-foreground">
          <h1>&copy; 2026 ShoeMart, All rights reserved</h1>
          <p className="text-sm mr-5 ml-8">Terms of Sale</p>
          <p className="text-sm mx-5">Terms of Use</p>
          <p className="text-sm mx-5">Privacy Policy</p>
          <p className="text-sm mx-5">Privacy Settings</p>
        </div>
      </div>

      <div className="bg-primary py-10 md:hidden flex flex-col justify-center items-center mt-20">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex flex-col text-primary-foreground">
            <h1 className="text-lg font-semibold mb-4">Resources</h1>
            <p className="my-1">Find a Store</p>
            <p className="my-1">Become a Member</p>
            <p className="my-1">Affiliate Program</p>
            <p className="my-1">Send Us Feedback</p>
          </div>
          <div className="flex flex-col text-primary-foreground">
            <h1 className="text-lg font-semibold mt-3 mb-3">Help</h1>
            <p className="my-1">Get Help</p>
            <p className="my-1">Order Status</p>
            <p className="my-1">Delivery</p>
            <p className="my-1">Returns</p>
            <p className="my-1">FAQ</p>
          </div>
          <div className="flex flex-col text-primary-foreground">
            <h1 className="text-lg font-semibold mb-5">Company</h1>
            <p className="my-1">About Shoe Mart</p>
            <p className="my-1">News</p>
            <p className="my-1">Investors</p>
            <p className="my-1">Report a Concern</p>
          </div>
          <div className="bg-white w-500 h-0.5" />
        </div>

        <div className="flex flex-col justify-center mt-4 gap-2 items-center text-primary-foreground">
          <h1>&copy; 2026 ShoeMart, All rights reserved</h1>
          <p className="text-sm mr-5 ml-8">Terms of Sale</p>
          <p className="text-sm mx-5">Terms of Use</p>
          <p className="text-sm mx-5">Privacy Policy</p>
          <p className="text-sm mx-5">Privacy Settings</p>
        </div>
      </div>
    </>
  );
}

export default Footer;
