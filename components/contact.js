export default function Contact() {
    return (
<section id="contact">
    <div className="container">
        <div className="row">
            <div className="col-lg-8 center-input">
                <div className="text-center">
                    <h2 className="section-heading">Contact</h2>
                    <hr className="primary"/>
                    <p></p>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-lg-2 offset-lg-2 text-center">
                <a href="https://www.tiktok.com/@benthamite">
                    <img src="/img/tiktok.svg" style={{width: '56px', height: '56px'}}/>
                    <p>@benthamite</p>
                </a>
            </div>
            <div className="col-lg-2 offset-lg-1 text-center">
                <a href="mailto:xodarap00@gmail.com">
                <i className="fas fa-envelope fa-4x" data-wow-delay=".1s" style={{'color': 'black'}}></i>
                    <p>xodarap00@gmail.com</p>
                </a>
            </div>
            <div className="col-lg-2 offset-lg-1 text-center">
                <a href="https://github.com/xodarap">
                <i className="fab fa-github fa-4x wow bounceIn" data-wow-delay=".1s" style={{'color': 'black'}}></i>
                    <p>Xodarap</p>
                </a>
        </div>
        </div>
    </div>
</section>
)}