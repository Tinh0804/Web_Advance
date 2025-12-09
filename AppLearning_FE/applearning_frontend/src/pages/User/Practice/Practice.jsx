import React from 'react';
import { useNavigate } from 'react-router-dom';
import unitService from '../../../services/unitService';

// Import icons
import animalIcon from '../../../assets/icons/animal.png';
import familyIcon from '../../../assets/icons/family.png';
import greetingIcon from '../../../assets/icons/greeting.png';
import musicIcon from '../../../assets/icons/music.png';
import technologyIcon from '../../../assets/icons/technology.png';

class Practice extends React.Component {
  state = {
    units: [],
    loading: true,
    error: null,
  };

  async componentDidMount() {
    try {
      const allUnits = await unitService.getAllUserUnits();
      const learnedUnits = allUnits
        .filter(unit => !unit.isLocked)
        .sort((a, b) => {
          if (a.courseId !== b.courseId) return a.courseId - b.courseId;
          return a.orderIndex - b.orderIndex;
        });
      this.setState({ units: learnedUnits, loading: false });
    } catch (error) {
      this.setState({
        error: 'Không tải được dữ liệu. Vui lòng thử lại sau.',
        loading: false,
      });
    }
  }

  getGroupedUnits = () => {
    const { units } = this.state;
    const grouped = {};
    units.forEach(unit => {
      if (!grouped[unit.courseId]) {
        grouped[unit.courseId] = { courseId: unit.courseId, units: [] };
      }
      grouped[unit.courseId].units.push(unit);
    });
    return Object.values(grouped);
  };

  // Random icon cho mỗi unit
  getUnitIcon = (unit) => {
    const icons = [greetingIcon, familyIcon, animalIcon, musicIcon, technologyIcon];
    return icons[unit.unitId % icons.length];
  };

  render() {
    const { loading, error } = this.state;
    const navigate = this.props.navigate;

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Đang tải các unit...</p>
          </div>
        </div>
      );
    }

    const groupedUnits = this.getGroupedUnits();
    const hasUnits = groupedUnits.flatMap(g => g.units).length > 0;

    if (error || !hasUnits) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <p className="text-2xl text-gray-600 mb-6">
            {error || 'Bạn chưa mở khóa unit nào'}
          </p>
          <button 
            onClick={() => navigate('/courses')}
            className="bg-purple-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-purple-700 transition"
          >
            Bắt đầu học ngay
          </button>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Choose your unit
          </h1>
          {groupedUnits.map(group => (
            <div key={group.courseId} className="mb-12 space-y-4">
              {group.units.map(unit => (
                <button
                  key={unit.unitId}
                  onClick={() => navigate(`/practice/unit/${unit.unitId}`)}
                  className="w-full bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex items-center gap-6 border-2 border-transparent hover:border-purple-300 text-left"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center flex-shrink-0 p-3">
                    <img 
                      src={this.getUnitIcon(unit)} 
                      alt="unit icon"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">Unit {unit.unitId}</h3>
                    <p className="text-gray-600 text-lg mt-1">{unit.unitName}</p>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const PracticeWithNavigate = (props) => {
  const navigate = useNavigate();
  return <Practice {...props} navigate={navigate} />;
};

export default PracticeWithNavigate;