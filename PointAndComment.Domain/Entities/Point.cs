    namespace PointAndComment.Domain.Entities;

    public class Point
    {
        public Guid Id { get; private set; }
        public float X { get; private set; }
        public float Y { get; private set; }
        public float Radius { get; private set; }
        public string Color { get; private set; }

        private readonly List<Comment> _comments = new();
        public virtual IReadOnlyCollection<Comment> Comments => _comments.AsReadOnly();

        private Point(){}
        public Point(float x, float y, float radius, string color)
        {
            Id = Guid.NewGuid();
            X = x;
            Y = y;
            Radius = radius;
            Color = color;
            
            Color = color ?? throw new ArgumentNullException(nameof(color));

            if (radius <= 0) throw new ArgumentOutOfRangeException(nameof(radius));
        }

        public void UpdatePosition(float x, float y)
        {
            X = x;
            Y = y;
        }

        public void UpdateRadius(float radius)
        {
            Radius = radius;
        }

        public void UpdateColor(string color)
        {
            Color = color;
        }

        private void AddComment(Comment comment)
        {
            _comments.Add(comment);
            comment.SetPoint(this);
        }
        public Comment AddComment(string text, string backgroundColor)
        {
            var comment = new Comment(text, backgroundColor);
            AddComment(comment);
            UpdateRadiusBasedOnComments();
            return comment;
        }
        
        private void UpdateRadiusBasedOnComments()
        {
            Radius = 30 + _comments.Count * 10;
        }

        public void RemoveComment(Comment comment)
        {
            if (!_comments.Contains(comment))
                throw new InvalidOperationException("Comment does not belong to this point");

            _comments.Remove(comment);          
            UpdateRadiusBasedOnComments();  
        }
    }