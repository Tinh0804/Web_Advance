import React from "react";
import { useNavigate, useParams } from "react-router-dom";

class ArrangeWordGame extends React.Component {
    render() {
        const { lessonId } = this.props.params;
        const navigate = this.props.navigate;
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-5xl font-bold text-gray-800 mb-4">Arrange Word Game</h1>
                        <p className="text-xl text-purple-600 font-semibold">
                            Lesson ID: {lessonId} — Arrange Word Game!
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

const ArrangeWordGameWithRouter = () => {
    const params = useParams(); // { lessonId: "89" }
    const navigate = useNavigate();
    return <ArrangeWordGame params={params} navigate={navigate} />;
};

export default ArrangeWordGameWithRouter;